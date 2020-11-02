import test from "ava";

import {
  YEAR,
  MONTH,
  WEEK,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  ReducedTime,
  reduceTime,
  roundTime,
  humanizeTime
} from "../../src/utils/time";
import English from "../../src/i18n/en/us";

test("can reduce time", t => {
  const years = 987656776618n;
  const months = 11n;
  const weeks = 3n;
  const days = 6n;
  const hours = 23n;
  const minutes = 59n;
  const seconds = 59n;
  const milliseconds = 999n;

  const result = reduceTime(
    years   * YEAR   +
    months  * MONTH  +
    weeks   * WEEK   +
    days    * DAY    +
    hours   * HOUR   +
    minutes * MINUTE +
    seconds * SECOND +
    milliseconds
  );

  t.is("object", typeof result);
  t.is(years, result.years);
  t.is(months, result.months);
  t.is(weeks, result.weeks);
  t.is(days, result.days);
  t.is(hours, result.hours);
  t.is(minutes, result.minutes);
  t.is(seconds, result.seconds);
  t.is(milliseconds, result.milliseconds);
});

test("can round time", t => {
  const time = {
    years: 0n,
    months: 11n,
    weeks: 3n,
    days: 4n,
    hours: 13n,
    minutes: 31n,
    seconds: 31n,
    milliseconds: 501n
  };

  const result = roundTime(time);

  t.is(1n, result.years);
  t.is(0n, result.months);
  t.is(0n, result.weeks);
  t.is(0n, result.days);
  t.is(0n, result.hours);
  t.is(0n, result.minutes);
  t.is(0n, result.seconds);
  t.is(0n, result.milliseconds);
});

test("can humanize time", t => {
    const result = humanizeTime(987654567898765456n * YEAR, English);

    t.is("987 quadrillion years", result);
});
