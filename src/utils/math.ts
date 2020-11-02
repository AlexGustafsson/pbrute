import {PBruteI18n} from "../i18n";

const humanization = {
  centillion: BigInt(10) ** BigInt(303),
  vigintillion: BigInt(10) ** BigInt(63),
  novemdecillion: BigInt(10) ** BigInt(60),
  octodecillion: BigInt(10) ** BigInt(57),
  septendecillion: BigInt(10) ** BigInt(54),
  sexdecillion: BigInt(10) ** BigInt(51),
  quindecillion: BigInt(10) ** BigInt(48),
  quattuordecillion: BigInt(10) ** BigInt(45),
  tredecillion: BigInt(10) ** BigInt(42),
  duodecillion: BigInt(10) ** BigInt(39),
  undecillion: BigInt(10) ** BigInt(36),
  decillion: BigInt(10) ** BigInt(33),
  nonillion: BigInt(10) ** BigInt(30),
  octillion: BigInt(10) ** BigInt(27),
  septillion: BigInt(10) ** BigInt(24),
  sextillion: BigInt(10) ** BigInt(21),
  quintillion: BigInt(10) ** BigInt(18),
  quadrillion: BigInt(10) ** BigInt(15),
  trillion: BigInt(10) ** BigInt(12),
  billion: BigInt(10) ** BigInt(9),
  million: BigInt(10) ** BigInt(6),
  thousand: BigInt(10) ** BigInt(3),
  hundred: BigInt(10) ** BigInt(2)
};

/**
* Humanize a number.
* @param value - The value to humanize.
* @param i18n - The internationalization dictionary to use.
* @returns The humanized number.
*/
export function humanizeNumber(value: bigint, i18n: PBruteI18n): string {
  for (const [name, number] of Object.entries(humanization)) {
    if (value >= number)
      return `${value / number} ${i18n.numbers[name as keyof typeof i18n.numbers]}`;
  }

  return value.toString();
}
