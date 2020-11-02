import {PBruteI18n} from "../i18n";
import {humanizeNumber} from "./math";

export const MILLISECOND = 1n;
export const SECOND = 1000n * MILLISECOND;
export const MINUTE = 60n * SECOND;
export const HOUR = 60n * MINUTE;
export const DAY = 24n * HOUR;
export const WEEK = 7n * DAY;
export const MONTH = 4n * WEEK;
export const YEAR = 365n * DAY;

export type ReducedTime = {
  milliseconds: bigint,
  seconds: bigint,
  minutes: bigint,
  hours: bigint,
  days: bigint,
  weeks: bigint,
  months: bigint,
  years: bigint
};

/**
* Reduce a millisecond time into years, months etc.
* @param time - The number of passed milliseconds.
* @returns A reduced time seperated into years, months etc.
*/
export function reduceTime(time: bigint): ReducedTime {
  // The thresholds are the number of milliseconds each value may contain
  const thresholds = [YEAR, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND, MILLISECOND];
  const values = [];
  for (let i = 0, reducedTime = time; i < thresholds.length; i++) {
    values[i] = reducedTime / thresholds[i];
    reducedTime -= values[i] * thresholds[i];
  }

  const [years, months, weeks, days, hours, minutes, seconds, milliseconds] = values;
  return {years, months, weeks, days, hours, minutes, seconds, milliseconds};
}

/**
* Round a reduced time. Rounds each component up to the next.
* @returns A new reduced time with rounded values.
*/
export function roundTime(time: ReducedTime): ReducedTime {
  const values = getSortedTimeValues(time);
  // The thresholds are where a value should be rounded to the next
  const thresholds = [500n, 30n, 30n, 12n, 3n, 2n, 6n];
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] > thresholds[i]) {
      values[i] = 0n;
      values[i + 1] += 1n;
    }
  }

  const [milliseconds, seconds, minutes, hours, days, weeks, months, years] = values;
  return {milliseconds, seconds, minutes, hours, days, weeks, months, years};
}

/**
* Humanize a time, making it readable with its largest factor translated
* with a suffix such as "thousand".
*/
export function humanizeTime(time: bigint, i18n: PBruteI18n): string {
  const roundedReducedTime = roundTime(reduceTime(time));
  const entries = getSortedTimeEntries(roundedReducedTime).reverse();
  for (const [key, value] of entries) {
    if (value > 0)
      return `${humanizeNumber(roundedReducedTime[key as keyof ReducedTime], i18n)} ${i18n[key as keyof PBruteI18n]}`;
  }
  return i18n["instant"];
}

/**
* Get the sorted time values from least significant (millisecond) to most significant (years).
* @param time - The rounded time.
*/
function getSortedTimeValues(time: ReducedTime): bigint[] {
  return getSortedTimeEntries(time).map(([_, value]) => value);
}

/**
* Get the sorted time entries from least significant (millisecond) to most significant (years).
* @param time - The rounded time.
*/
function getSortedTimeEntries(time: ReducedTime): [string, bigint][] {
  const order = ["milliseconds", "seconds", "minutes", "hours", "days", "weeks", "months", "years"];
  const entries = Object.entries(time);
  entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  return entries;
}
