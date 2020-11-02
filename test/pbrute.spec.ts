import test from "ava";

import PBrute from "../src/pbrute";
import English from "../src/i18n/en/us";

test("can calculate character set for lowercase password", t => {
  const pbrute = new PBrute();

  const password = "password";
  const result = pbrute.calculateCharacterSets(password);

  t.is(26, result[0].count);
});

test("can calculate character set for uppercase password", t => {
  const pbrute = new PBrute();

  const password = "PASSWORD";
  const result = pbrute.calculateCharacterSets(password);

  t.is(26, result[0].count);
});

test("can calculate character set for lower and uppercase password", t => {
  const pbrute = new PBrute();

  const password = "passWORD";
  const result = pbrute.calculateCharacterSets(password);

  t.is(52, result[0].count + result[1].count);
});

test("can calculate character set for common special characters", t => {
  const pbrute = new PBrute();

  const password = "!?";
  const result = pbrute.calculateCharacterSets(password);

  t.is(33, result[0].count);
});

test("can calculate character set for common accented characters", t => {
  const pbrute = new PBrute();

  const password = "åäö";
  const result = pbrute.calculateCharacterSets(password);

  t.is(57, result[0].count);
});

test("can calculate combined character set", t => {
  const pbrute = new PBrute();

  const password = "p4$$WÖRD!";
  const result = pbrute.calculateCharacterSets(password);

  t.is(152, result.reduce((sum, x) => sum + x.count, 0));
});

test("can calculate character set combinations", t => {
  const pbrute = new PBrute();

  const password = "password";
  const result = pbrute.calculateCombinations(password);

  t.is(BigInt(26) ** BigInt(8), result);
});

test("can compute hash time", t => {
  const pbrute = new PBrute();

  const result = pbrute.calculateTimeToHash(45678909875435678765434123n);

  t.is("object", typeof result);
  for (const key of Object.keys(result))
    t.is("bigint", typeof result[key as keyof object]);
});

test("can calculate weak password strength", t => {
  const pbrute = new PBrute({i18n: English, dictionary: ["password"]});

  const password = "password";
  const result = pbrute.calculate(password);

  t.is("3 seconds", result.optimistic);
  t.is("instant", result.likely);
  t.is("instant", result.pessimistic);
});
