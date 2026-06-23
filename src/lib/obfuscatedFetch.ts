import { decryptPayload, encryptPayload } from '@/lib/crypto';

function isTransportEnvelope(data: unknown): data is { payload: string } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  const record = data as Record<string, unknown>;
  const keys = Object.keys(record);

  return keys.length === 1 && keys[0] === 'payload' && typeof record.payload === 'string' && record.payload.startsWith('enc:');
}

type WindowWithSatsFetch = Window & typeof globalThis & {
  __satsOriginalFetch?: typeof fetch;
};

const UPLOAD_PATHS = [
  '/users/tasks/',
  '/users/standalone-tasks/',
  '/users/bug-reports',
  '/admin/campaigns/upload-cover',
];

const RAW_BYPASS_PATHS = [
  '/api/auth/',
  '/api/public/announcements/active',
];

function getRequestUrl(input: RequestInfo | URL) {
  return typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
}

function isApiUrl(input: RequestInfo | URL) {
  return getRequestUrl(input).includes('/api/');
}

function isRawBypassUrl(input: RequestInfo | URL) {
  const url = getRequestUrl(input);
  return RAW_BYPASS_PATHS.some((path) => url.includes(path));
}

function getMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) {
    return init.method.toUpperCase();
  }

  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.method.toUpperCase();
  }

  return 'GET';
}

function isMultipartBody(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function needsMultipartObfuscation(url: string, body: BodyInit | null | undefined) {
  return isMultipartBody(body) && UPLOAD_PATHS.some((path) => url.includes(path));
}

function shouldBypassBodyObfuscation(method: string, body: BodyInit | null | undefined) {
  if (method === 'GET' || method === 'HEAD') {
    return true;
  }

  return !body;
}

export async function obfuscatedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const satsWindow = window as WindowWithSatsFetch;
  const originalFetch = satsWindow.__satsOriginalFetch || window.fetch.bind(window);

  if (!isApiUrl(input)) {
    return originalFetch(input, init);
  }

  if (isRawBypassUrl(input)) {
    return originalFetch(input, init);
  }

  const url = getRequestUrl(input);
  const method = getMethod(input, init);
  const nextInit: RequestInit = { ...(init || {}) };
  const headers = new Headers(nextInit.headers || {});
  const body = nextInit.body;

  if (shouldBypassBodyObfuscation(method, body)) {
    headers.set('x-obfuscated-response', '1');
    nextInit.headers = headers;
    const response = await originalFetch(input, nextInit);
    return decryptObfuscatedResponse(response);
  }

  if (needsMultipartObfuscation(url, body)) {
    const sourceFormData = body as FormData;
    const formData = new FormData();
    const plainPayload: Record<string, FormDataEntryValue> = {};

    Array.from(sourceFormData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      plainPayload[key] = value;
    });

    const encrypted = await encryptPayload(JSON.stringify(plainPayload));
    formData.append('__payload', encrypted || '');
    headers.set('x-obfuscated-multipart', '1');
    headers.set('x-obfuscated-response', '1');
    nextInit.headers = headers;
    nextInit.body = formData;
  } else if (typeof body === 'string') {
    const encrypted = await encryptPayload(body);
    headers.set('Content-Type', 'application/json');
    headers.set('x-obfuscated', '1');
    headers.set('x-obfuscated-response', '1');
    nextInit.headers = headers;
    nextInit.body = JSON.stringify({ payload: encrypted });
  } else if (
    body &&
    typeof body === 'object' &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof URLSearchParams) &&
    !(typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  ) {
    const encrypted = await encryptPayload(JSON.stringify(body));
    headers.set('Content-Type', 'application/json');
    headers.set('x-obfuscated', '1');
    headers.set('x-obfuscated-response', '1');
    nextInit.headers = headers;
    nextInit.body = JSON.stringify({ payload: encrypted });
  }

  const response = await originalFetch(input, nextInit);
  return decryptObfuscatedResponse(response);
}

async function decryptObfuscatedResponse(response: Response) {
  const responseClone = response.clone();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return response;
  }

  try {
    const data = await responseClone.json();

    if (!isTransportEnvelope(data)) {
      return response;
    }

    const decrypted = await decryptPayload(data.payload);
    const parsed = decrypted ? JSON.parse(decrypted) : {};
    const blob = new Blob([JSON.stringify(parsed)], { type: 'application/json' });

    return new Response(blob, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch {
    return response;
  }
}

export async function parseObfuscatedJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('Expected JSON response.');
  }

  const data = await response.json();

  if (!isTransportEnvelope(data)) {
    return data as T;
  }

  try {
    const decrypted = await decryptPayload(data.payload);
    return (decrypted ? JSON.parse(decrypted) : {}) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to decrypt transport payload.';
    throw new Error(message);
  }
}

export async function obfuscatedJsonRequest<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await obfuscatedFetch(input, init);
  const data = await parseObfuscatedJson<T | { error?: string; message?: string }>(response);

  if (!response.ok) {
    const errorPayload = data as { error?: string; message?: string } | null;
    throw new Error(errorPayload?.error || errorPayload?.message || 'Request failed.');
  }

  return data as T;
}
