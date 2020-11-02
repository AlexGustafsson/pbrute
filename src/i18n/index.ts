export type PBruteI18n = {
  instant: string,
  numbers: {
    hundred: string,
    thousand: string,
    million: string,
    billion: string,
    trillion: string,
    quadrillion: string,
    quintillion: string,
    sextillion: string,
    septillion: string,
    octillion: string,
    nonillion: string,
    decillion: string,
    undecillion: string,
    duodecillion: string,
    tredecillion: string,
    quattuordecillion: string,
    quindecillion: string,
    sexdecillion: string,
    septendecillion: string,
    octodecillion: string,
    novemdecillion: string,
    vigintillion: string,
    centillion: string
  },
  characterSet: {
    lowercase: string,
    uppercase: string,
    digits: string,
    commonSpecial: string,
    commonAccented: string
  },
  length: {
     veryShort: string,
     short: string
  },
  common: {
    head: string,
    tail: string
  },
  variety: string,
  years: string,
  months: string,
  weeks: string,
  days: string,
  hours: string,
  minutes: string,
  seconds: string,
  milliseconds: string,
  pattern: {
    short: string,
    long: string,
    repeating: string,
    repeatingCharacter: string
  }
};

/**
* Translate a object path such as number.hundreds using the given i18n dictionary.
* @returns The translation or an empty string if the translation failed.
*/
export function translate(path: string, i18n: PBruteI18n): string {
  const keys = path.split(".");
  let value = i18n;
  for (const key of keys) {
    if (typeof value === "string")
      return "";
    if (typeof value[key as keyof object] === "undefined")
      return "";

    value = value[key as keyof object];
  }

  return value.toString();
}
