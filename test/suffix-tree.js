import test from 'ava';

const SuffixTree = require('../lib/suffix-tree');

test('can find longest repeating substring', t => {
  const tree = new SuffixTree('abababa');
  const longestSuffix = tree.findLongestRepeatingSubstring();

  t.is('ababa', longestSuffix);
});

test('cannot find longest repeating substring for non-repeating string', t => {
  const tree = new SuffixTree('abcd');
  const longestSuffix = tree.findLongestRepeatingSubstring();

  t.is('', longestSuffix);
});

test('can find longest repeating substring for only one repeating character', t => {
  const tree = new SuffixTree('abgasha');
  const longestSuffix = tree.findLongestRepeatingSubstring();

  t.is('a', longestSuffix);
});
