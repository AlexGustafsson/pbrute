import test from 'ava';

const {
  integerDivision,
  request,
  sha1
} = require('../lib/utils');

test('can divide BigInts', t => {
  const a = 12n;
  const b = 7n;

  const result = integerDivision(a, b);

  t.is(1n, result);
});

test('can perform request', async t => {
  const response = await request('https://pbrute.axgn.se');
  t.true(typeof response === 'string');
});

test('can perform SHA-1 hash', async t => {
  const digest = await sha1('PBrute');
  t.is('9121831bc2fc8fe0b06d8c458016d0438ecc6aca', digest);
});
