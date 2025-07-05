// src/lib/esewa/verifySignature.ts

import CryptoJS from "crypto-js";

/**
 * Generates a Base64-encoded HMAC SHA256 signature using the eSewa secret key.
 *
 * @param message - The message string to be signed or verified.
 * @returns Base64-encoded HMAC-SHA256 signature.
 */
export function generateEsewaSignature(message: string): string {
  const secretKey = process.env.ESEWA_SECRET_CODE;

  if (!secretKey) {
    throw new Error("Missing ESEWA_SECRET_KEY in environment variables.");
  }

  const hash = CryptoJS.HmacSHA256(message, secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return hashInBase64;
}
