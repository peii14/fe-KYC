import * as eccrypto from "eccrypto";
import { ec as EC } from "elliptic";
import { asn1 } from "asn1.js";
import fs from "fs";

export async function generateECIESKeyPair() {
  const privateKey = eccrypto.generatePrivate();
  const eciesKeyPair = {
    privateKey: privateKey,
    publicKey: eccrypto.getPublic(privateKey),
  };
  return eciesKeyPair;
}

// Encrypt data for multiple recipients
export async function encryptDataForMultipleRecipients(
  publicKeys: Buffer,
  data: string
) {
  const encrypted = await eccrypto.encrypt(publicKeys, Buffer.from(data));
  return encrypted;
}

// Decrypt data using the private key
export async function decryptData(
  privateKey: Buffer,
  encrypted: eccrypto.Encrypted
): Promise<string> {
  const decryptedBuffer = await eccrypto.decrypt(privateKey, encrypted);
  return decryptedBuffer.toString();
}
// get the public key from the private key
export function getPublicECIES(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data).publicKey);
      }
    });
  });
}
export function getPrivateECIES(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data).privateKey);
      }
    });
  });
}

export function convertToBufferObject(encryptedObj) {
    return {
      iv: Buffer.from(encryptedObj.iv.data),
      ephemPublicKey: Buffer.from(encryptedObj.ephemPublicKey.data),
      ciphertext: Buffer.from(encryptedObj.ciphertext.data),
      mac: Buffer.from(encryptedObj.mac.data),
    };
  }
  
