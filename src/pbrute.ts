import SuffixTree from "./suffix-tree";
import {humanizeTime} from "./utils/time";
import {PBruteI18n, translate} from "./i18n";

export type CharacterSet = {name: string, count: number, regex: RegExp}

const DEFAULT_CHARACTER_SETS = [
  {
    name: "lowercase",
    count: 26,
    regex: /[a-z]/
  },
  {
    name: "uppercase",
    count: 26,
    regex: /[A-Z]/
  },
  {
    name: "digits",
    count: 10,
    regex: /\d/
  },
  {
    // https://www.owasp.org/index.php/Password_special_characters
    name: "common-special",
    count: 33,
    regex: /[ !"#$%&"()*+,-./:;<=>?@[\\\]^_`{|}~]/
  },
  {
    // https://practicaltypography.com/common-accented-characters.html
    name: "common-accented",
    count: 57,
    regex: /[áÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ]/
  },
  {
    name: "others",
    count: null,
    regex: /[áÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ]/
  }
] as CharacterSet[];

const DEFAULT_CALCULATION_TIMES = {
  // From: https://www.onlinehashcrack.com/tools-benchmark-hashcat-gtx-1080-ti-1070-ti.php
  md5: 55120000n,
  sha1: 16980000n,
  sha256: 7650910n,
  ntlm: 77790000n,
  bcrypt: 2845n,
  // OWASP recommends to tune hashing functions to at least one second
  owasp: 1000n,
  // Google recommends a maximum three second page load time
  online: 3000n
} as HashCalculationTimes;

export type HashCalculationTimes = {
  md5: bigint,
  sha1: bigint,
  sha256: bigint,
  ntlm: bigint,
  bcrypt: bigint,
  owasp: bigint,
  online: bigint
}

export type PBruteOptions = {
   dictionary?: string[],
   i18n?: PBruteI18n,
   calculationTimes?: HashCalculationTimes,
   characterSets?: CharacterSet[]
}

export default class PBrute {
  dictionary: string[]
  i18n: PBruteI18n
  calculationTimes: HashCalculationTimes
  characterSets: CharacterSet[]

  constructor(options: PBruteOptions = {}) {
    this.dictionary = options.dictionary || [];
    this.i18n = options.i18n || {} as PBruteI18n;
    this.calculationTimes = options.calculationTimes || DEFAULT_CALCULATION_TIMES;
    this.characterSets = options.characterSets || DEFAULT_CHARACTER_SETS;
  }

  /**
  * Calculate ...
  */
  calculate(password: string) {
    const characterSets = this.calculateCharacterSets(password);
    const combinations = this.calculateCombinations(password);
    const time = this.calculateTimeToHash(combinations);
    const dictionaryIndex = this.dictionaryIndex(password);

    const messages = [];

    let optimistic;
    let pessimistic;
    let likely;
    if (dictionaryIndex === -1) {
      // Best case (slowest cracking)
      optimistic = humanizeTime(time.online / 2n, this.i18n);
      // Worst case (fastest cracking)
      pessimistic = humanizeTime(time.ntlm / 2n, this.i18n);
      // Likely case (likely most common)
      likely = humanizeTime(time.md5 / 2n, this.i18n);
    } else {
      messages.push({type: "common", text: `${translate("common.head", this.i18n)} ${dictionaryIndex} ${translate("common.tail", this.i18n)}`});
      // Best case (slowest cracking)
      optimistic = humanizeTime(this.calculationTimes.online * BigInt(dictionaryIndex + 1), this.i18n);
      // Worst case (fastest cracking)
      pessimistic = translate("instant", this.i18n);
      // Likely case (likely most common)
      likely = translate("instant", this.i18n);
    }

    if (password.length < 8)
      messages.push({type: "length", text: translate("length.veryShort", this.i18n)});
    else if (password.length < 10)
      messages.push({type: "length", text: translate("length.short", this.i18n)});

    if (characterSets.length === 1 && characterSets[0].name !== "others")
      messages.push({type: "variety", text: `${translate("variety", this.i18n)} ${translate(`characterSet.${characterSets[0].name}`, this.i18n)}`});

    const suffixTree = new SuffixTree(password);
    const longestSuffix = suffixTree.findLongestRepeatingSubstring();
    const suffixOccurances = password.split(longestSuffix).length - 1;
    if (longestSuffix.length > 4)
      messages.push({type: "pattern", text: `${translate("pattern.long", this.i18n)}`});
    else if (longestSuffix.length > 1)
      messages.push({type: "pattern", text: `${translate("pattern.short", this.i18n)}`});
    if (longestSuffix.length > 1 && suffixOccurances > 2)
      messages.push({type: "pattern", text: `${translate("pattern.repeating", this.i18n)}`});
    else if (longestSuffix.length > 0 && suffixOccurances > 2)
      messages.push({type: "pattern", text: `${translate("pattern.repeatingCharacter", this.i18n)}`});

    return {
      combinations,
      time,
      optimistic,
      likely,
      pessimistic,
      messages
    };
  }

  calculateCombinations(password: string): bigint {
    const characterSets = this.calculateCharacterSets(password);
    // Assumes the count won't overflow a regular Number
    const characters = characterSets.reduce((sum: number, set: CharacterSet) => sum + set.count, 0);

    return BigInt(characters) ** BigInt(password.length);
  }

  /** Find the character sets the password uses. */
  calculateCharacterSets(password: string): CharacterSet[] {
    const characterSets: CharacterSet[] = [];

    for (const characterSet of this.characterSets) {
      if (password.match(characterSet.regex))
        characterSets.push(characterSet);
    }

    return characterSets;
  }

  /**
  * Calculates the time necessary to compute the hash in milliseconds (worst-case scenario)
  * where the correct guess is the last guess made.
  * @param combinations - The number of possible combinations.
  */
  calculateTimeToHash(combinations: bigint): HashCalculationTimes {
    return {
      md5: combinations / this.calculationTimes.md5,
      sha1: combinations / this.calculationTimes.sha1,
      sha256: combinations / this.calculationTimes.sha256,
      bcrypt: combinations / this.calculationTimes.bcrypt,
      ntlm: combinations / this.calculationTimes.ntlm,
      owasp: combinations * this.calculationTimes.owasp,
      online: combinations * this.calculationTimes.online
    };
  }

  /**
  * Get the index of the password in the configured dictionary.
  * @param password - The password to check.
  * @returns The index of the password in the dictionary or -1 if not found.
  */
  dictionaryIndex(password: string): number {
    return this.dictionary.indexOf(password);
  }
}
