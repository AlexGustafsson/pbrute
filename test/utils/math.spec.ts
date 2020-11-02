import test from "ava";

import {humanizeNumber} from "../../src/utils/math";
import English from "../../src/i18n/en/us";

test("can humanize numbers", t => {
  const decillion = humanizeNumber(10n ** 33n, English);

  t.is("1 decillion", decillion);
});
