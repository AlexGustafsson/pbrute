import * as shared from "./shared";

// Perform a HTTPS GET request in Node or the browser
export async function request(path: string): Promise<string> {
  const response = await window.fetch(path);
  return await response.text();
}

/**
* Hash a message using SHA-1. Works in Node or a browser environment.
* @param message - The message to digest.
* @returns Upper case hex digest.
*/
export async function shasum(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(message);
  const digest = await window.crypto.subtle.digest("SHA-1", buffer);
  const digestArray = [...new Uint8Array(digest)];
  const hex = digestArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  return hex.toUpperCase();
}

/**
* Perform a lookup towards https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange
* using an k-anonymity model.
* @param password - The password to check.
* @returns The number of occurcances in the dataset.
*/
export function haveIBeenPwned(password: string): Promise<number> {
  return shared.haveIBeenPwned(password, shasum, request);
}
