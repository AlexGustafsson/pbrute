interface IShaSum {
  (message: string): Promise<string>;
}

interface IRequest {
  (path: string): Promise<string>;
}

/**
* Perform a lookup towards https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange
* using an k-anonymity model.
* @param password - The password to check.
* @param shasum - A SHA-1 hash function.
* @param request - A HTTPS GET request function.
* @returns The number of occurcances in the dataset.
*/
export async function haveIBeenPwned(password: string, shasum: IShaSum, request: IRequest): Promise<number> {
  const digest = await shasum(password);
  const response = await request(`https://api.pwnedpasswords.com/range/${digest.slice(0, 5)}`);
  const possibleDigests = response.split("\n").map((line: string) => line.split(":"));
  for (const [possibleDigest, occurances] of possibleDigests) {
    if (digest.indexOf(possibleDigest) === 5)
      return Number(occurances);
  }

  return 0;
}
