import {IncomingMessage} from "http";
import {createHash} from "crypto";
import * as https from "https";

import * as shared from "./shared";

/** Perform a GET request. */
export async function request(path: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const request = https.get(path, (request: IncomingMessage) => {
      let data = "";

      request.on("data", (chunk: string) => {
        data += chunk;
      });

      request.on("end", () => {
        resolve(data.replace(/\r\n/g, "\n"));
      });
    });

    request.on("error", error => reject(error));
  });
}

/**
* Hash a message using SHA-1.
* @param message - The message to digest.
* @returns Upper case hex digest.
*/
export async function shasum(message: string): Promise<string> {
  const shasum = createHash("sha1");
  shasum.update(message);
  return shasum.digest("hex").toUpperCase();
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
