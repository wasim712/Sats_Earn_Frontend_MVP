const ENCRYPTION_PREFIX = 'enc:';

function getSecret() {
  return process.env.NEXT_PUBLIC_TRANSPORT_OBFUSCATION_KEY || 'satsearn-transport-key';
}

async function getKeyMaterial() {
  return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(getSecret()));
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

  const key = await getCryptoKey();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: fromHex(ivHex) },
    key,
    fromHex(encryptedHex),
  );

  return new TextDecoder().decode(decrypted);
}
