# WhisperBox - Encrypted Messaging App

A secure messaging application with end-to-end encryption. Built for HNG Stage 4B.

## Live Demo

[Link will be added after deployment]

## Tech Stack

- React + Vite
- Axios for API calls
- Web Crypto API for encryption
- JWT for authentication

## What This App Will Do

- Users can register and login
- Messages are encrypted on the sender's device using AES-GCM
- Only the intended recipient can decrypt messages
- Server only stores encrypted ciphertext (cannot read messages)
- Private keys never leave the client device

## Project Status

🚧 In active development. Core features coming:

- [ ] Authentication (JWT)
- [ ] Key generation and management
- [ ] AES-GCM encryption/decryption
- [ ] Send and receive encrypted messages
- [ ] User identity management

## Setup Instructions (for local testing)

```bash
git clone https://github.com/Gracogen/whisperbox-client.git
cd whisperbox-client
npm install
npm run dev