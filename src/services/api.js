import axios from 'axios';
import { 
  generateRSAKeyPair, 
  exportPublicKeyAsBase64,
  exportPrivateKeyAsBase64,
  generateSalt, 
  deriveKeyFromPassword, 
  wrapPrivateKey 
} from '../utils/crypto';

const API_BASE_URL = 'https://whisperbox.koyeb.app';

// Register a new user with full encryption
export const register = async (username, displayName, password) => {
  try {
    // Step 1: Generate RSA key pair
    const keyPair = await generateRSAKeyPair();
    
    // Step 2: Export public key as Base64
    const publicKeyBase64 = await exportPublicKeyAsBase64(keyPair.publicKey);
    
    // Step 3: Generate random salt
    const salt = generateSalt();
    
    // Step 4: Derive encryption key from password + salt
    const wrappingKey = await deriveKeyFromPassword(password, salt);
    
    // Step 5: Wrap (encrypt) the private key
    const wrappedPrivateKey = await wrapPrivateKey(keyPair.privateKey, wrappingKey);
    
    // Step 6: Send registration request
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: username,
      display_name: displayName,
      password: password,
      public_key: publicKeyBase64,
      wrapped_private_key: wrappedPrivateKey,
      pbkdf2_salt: salt
    });
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
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