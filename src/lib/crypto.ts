const ENCRYPTION_PREFIX = 'enc:';
const DEFAULT_TRANSPORT_SECRET = 'satsearn-transport-key';
const DEFAULT_BACKEND_JWT_SECRET = 'your_super_long_random_secret_string_here_do_not_share';

function splitSecrets(value?: string) {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSecret() {
  return process.env.NEXT_PUBLIC_TRANSPORT_OBFUSCATION_KEY || DEFAULT_TRANSPORT_SECRET;
}

function getSecrets() {
  return Array.from(new Set([
    process.env.NEXT_PUBLIC_TRANSPORT_OBFUSCATION_KEY,
    ...splitSecrets(process.env.NEXT_PUBLIC_TRANSPORT_OBFUSCATION_KEYS),
    process.env.NEXT_PUBLIC_FIELD_ENCRYPTION_KEY,
    process.env.NEXT_PUBLIC_JWT_SECRET,
    DEFAULT_TRANSPORT_SECRET,
    DEFAULT_BACKEND_JWT_SECRET,
  ].filter((value): value is string => Boolean(value))));
}

async function getKeyMaterial() {
  return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(getSecret()));
}

async function getKeyMaterialForSecret(secret: string) {
  return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(hex.substr(index * 2, 2), 16);
  }
  return bytes;
}

async function getCryptoKey() {
  const raw = await getKeyMaterial();
  return window.crypto.subtle.importKey('raw', raw, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
}

async function getCryptoKeyForSecret(secret: string) {
  const raw = await getKeyMaterialForSecret(secret);
  return window.crypto.subtle.importKey('raw', raw, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
}

export async function encryptPayload(value: string) {
  if (!value) return null;
  if (value.startsWith(ENCRYPTION_PREFIX)) return value;

  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await getCryptoKey();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    new TextEncoder().encode(value),
  );

  return `${ENCRYPTION_PREFIX}${toHex(iv.buffer)}:${toHex(encrypted)}`;
}

export async function decryptPayload(value?: string | null) {
  if (!value) return null;
  if (!value.startsWith(ENCRYPTION_PREFIX)) return value;

  const payload = value.slice(ENCRYPTION_PREFIX.length);
  const [ivHex, encryptedHex] = payload.split(':');
  if (!ivHex || !encryptedHex) return value;

  for (const secret of getSecrets()) {
    try {
      const key = await getCryptoKeyForSecret(secret);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: fromHex(ivHex) },
        key,
        fromHex(encryptedHex),
      );

      return new TextDecoder().decode(decrypted);
    } catch {
      continue;
    }
  }

  throw new Error('Unable to decrypt transport payload with known frontend keys.');
}
