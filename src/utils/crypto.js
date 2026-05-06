// Convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate RSA key pair
export async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
  return keyPair;
}

// Export public key as Base64 string
export async function exportPublicKeyAsBase64(publicKey) {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  return arrayBufferToBase64(exported);
}

// Export private key as Base64 string
export async function exportPrivateKeyAsBase64(privateKey) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return arrayBufferToBase64(exported);
}

// Generate random salt
export function generateSalt() {
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);
  return arrayBufferToBase64(salt);
}

// Derive encryption key from password and salt
export async function deriveKeyFromPassword(password, saltBase64) {
  const salt = base64ToArrayBuffer(saltBase64);
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  
  return derivedKey;
}

// Wrap (encrypt) private key
export async function wrapPrivateKey(privateKey, wrappingKey) {
  const exportedKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    wrappingKey,
    exportedKey
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return arrayBufferToBase64(combined);
}