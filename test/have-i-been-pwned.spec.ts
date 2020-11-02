import test from "ava";

import {haveIBeenPwned} from "../src/have-i-been-pwned/node";

test("can check password towards haveibeenpwned", async t => {
  const password = "password";
  const occurances = await haveIBeenPwned(password);

  // Assume "password" is in the dataset, which is a reasonable assumption
  t.true(occurances > 0);
});
