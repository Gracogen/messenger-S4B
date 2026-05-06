// // ============================================
// // CRYPTO UTILITIES - Web Crypto API (built into browser)
// // ============================================

// // Generate RSA key pair (public + private keys)
// // Used for encrypting messages between users
// export async function generateRSAKeyPair() {
//   // Generate the key pair
//   const keyPair = await window.crypto.subtle.generateKey(
//     {
//       name: "RSA-OAEP",           // Algorithm for encryption
//       modulusLength: 2048,        // Key size - standard for RSA
//       publicExponent: new Uint8Array([1, 0, 1]), // 65537 - standard value
//       hash: "SHA-256"             // Hashing algorithm
//     },
//     true,  // extractable = true (allows exporting the keys)
//     ["encrypt", "decrypt"]        // What the keys can do
//   );
  
//   return keyPair; // Returns { publicKey, privateKey } as CryptoKey objects
// }

// // Export public key as Base64 string (so server can store it)
// export async function exportPublicKeyAsBase64(publicKey) {
//   // Export the key as raw binary data (SPKI format)
//   const exported = await window.crypto.subtle.exportKey("spki", publicKey);
//   // Convert binary to Base64 string
//   return arrayBufferToBase64(exported);
// }

// // Export private key as Base64 string (for storing locally)
// export async function exportPrivateKeyAsBase64(privateKey) {
//   // Export as PKCS #8 format (standard for private keys)
//   const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
//   // Convert binary to Base64 string
//   return arrayBufferToBase64(exported);
// }

// // Import private key from Base64 string (to decrypt messages later)
// export async function importPrivateKeyFromBase64(base64Key) {
//   const binary = base64ToArrayBuffer(base64Key);
//   return await window.crypto.subtle.importKey(
//     "pkcs8",           // Format the key was exported in
//     binary,
//     {
//       name: "RSA-OAEP",
//       hash: "SHA-256"
//     },
//     true,              // extractable
//     ["decrypt"]        // What this key can do
//   );
// }

// // Import public key from Base64 string (to encrypt messages for someone)
// export async function importPublicKeyFromBase64(base64Key) {
//   const binary = base64ToArrayBuffer(base64Key);
//   return await window.crypto.subtle.importKey(
//     "spki",            // Format the key was exported in
//     binary,
//     {
//       name: "RSA-OAEP",
//       hash: "SHA-256"
//     },
//     true,              // extractable
//     ["encrypt"]        // What this key can do
//   );
// }

// // ============================================
// // HELPER FUNCTIONS - Convert between ArrayBuffer and Base64
// // ============================================

// // Convert ArrayBuffer to Base64 string
// function arrayBufferToBase64(buffer) {
//   const bytes = new Uint8Array(buffer);
//   let binary = '';
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// }

// // Convert Base64 string to ArrayBuffer
// function base64ToArrayBuffer(base64) {
//   const binary = atob(base64);
//   const bytes = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     bytes[i] = binary.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

// // Generate random salt (for PBKDF2 - used to derive encryption key from password)
// export function generateSalt() {
//   const salt = new Uint8Array(16); // 128 bits = 16 bytes
//   window.crypto.getRandomValues(salt);
//   return arrayBufferToBase64(salt);
// }

// // Derive encryption key from password and salt (PBKDF2)
// // This is used to encrypt/decrypt the private key before storing on server
// export async function deriveKeyFromPassword(password, saltBase64) {
//   // Convert salt from Base64 to ArrayBuffer
//   const salt = base64ToArrayBuffer(saltBase64);
  
//   // Import password as a key (raw format)
//   const encoder = new TextEncoder();
//   const passwordBuffer = encoder.encode(password);
  
//   const baseKey = await window.crypto.subtle.importKey(
//     "raw",
//     passwordBuffer,
//     "PBKDF2",
//     false,
//     ["deriveKey"]
//   );
  
//   // Derive a 256-bit AES key using PBKDF2
//   const derivedKey = await window.crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt: salt,
//       iterations: 100000,        // 100,000 iterations for security
//       hash: "SHA-256"
//     },
//     baseKey,
//     {
//       name: "AES-KW",           // AES Key Wrap - for encrypting keys
//       length: 256
//     },
//     true,                       // extractable
//     ["wrapKey", "unwrapKey"]    // Can wrap (encrypt) and unwrap (decrypt) keys
//   );
  
//   return derivedKey;
// }

// // Wrap (encrypt) private key using password-derived key
// // This creates the wrapped_private_key that gets sent to server
// export async function wrapPrivateKey(privateKey, wrappingKey) {
//   const wrapped = await window.crypto.subtle.wrapKey(
//     "pkcs8",              // Format of the key being wrapped
//     privateKey,           // The private key to encrypt
//     wrappingKey,          // The AES key used to encrypt it
//     "AES-KW"              // Algorithm for wrapping
//   );
//   return arrayBufferToBase64(wrapped);
// }

// // Unwrap (decrypt) private key using password-derived key
// // Used when user logs in and needs their private key back
// export async function unwrapPrivateKey(wrappedPrivateKeyBase64, wrappingKey) {
//   const wrappedBinary = base64ToArrayBuffer(wrappedPrivateKeyBase64);
  
//   return await window.crypto.subtle.unwrapKey(
//     "pkcs8",              // Format to output
//     wrappedBinary,        // The encrypted private key
//     wrappingKey,          // The AES key to decrypt it
//     "AES-KW",             // Algorithm used for wrapping
//     {
//       name: "RSA-OAEP",
//       hash: "SHA-256"
//     },
//     true,                 // extractable
//     ["decrypt"]           // What the unwrapped key can do
//   );
// }






import axios from 'axios';
import { generateRSAKeyPair, exportPublicKeyAsBase64, generateSalt, deriveKeyFromPassword, wrapPrivateKey, exportPrivateKeyAsBase64 } from '../utils/crypto';

const API_BASE_URL = 'https://whisperbox.koyeb.app';

// Register a new user with full encryption
export const register = async (username, displayName, password) => {
  // Step 1: Generate RSA key pair
  const keyPair = await generateRSAKeyPair();
  
  // Step 2: Export public key as Base64 (will be sent to server)
  const publicKeyBase64 = await exportPublicKeyAsBase64(keyPair.publicKey);
  
  // Step 3: Export private key as Base64 (for wrapping)
  const privateKeyBase64 = await exportPrivateKeyAsBase64(keyPair.privateKey);
  
  // Step 4: Generate random salt
  const salt = generateSalt();
  
  // Step 5: Derive encryption key from password + salt
  const wrappingKey = await deriveKeyFromPassword(password, salt);
  
  // Step 6: Wrap (encrypt) the private key using the derived key
  const wrappedPrivateKey = await wrapPrivateKey(keyPair.privateKey, wrappingKey);
  
  // Step 7: Send registration request with all required fields
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username: username,
    display_name: displayName,
    password: password,
    public_key: publicKeyBase64,
    wrapped_private_key: wrappedPrivateKey,
    pbkdf2_salt: salt
  });
  
  return response.data;
};

// Login user
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password
  });
  return response.data;
};

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Remove token on logout
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Save user keys securely (for later decryption)
export const saveUserKeys = (privateKeyBase64, salt) => {
  localStorage.setItem('userPrivateKey', privateKeyBase64);
  localStorage.setItem('userSalt', salt);
};

// Get user keys
export const getUserKeys = () => {
  return {
    privateKeyBase64: localStorage.getItem('userPrivateKey'),
    salt: localStorage.getItem('userSalt')
  };
};