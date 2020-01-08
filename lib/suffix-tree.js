class SuffixTreeNode {
  constructor(suffix) {
    this.suffix = suffix;
    this.children = {};
    this.indexes = [];
  }
}

class SuffixTree {
  constructor(text) {
    this.text = text;
    this.root = new SuffixTreeNode('');

    for (let i = 0; i < text.length; i++) {
      const suffix = text.slice(i);
      this.addNode(this.root, suffix, i, suffix);
    }

    this.simplify(this.root);
  }

  addNode(root, suffix, index) {
    root.indexes.push(index);

    if (suffix === '')
      return;

    let child = null;
    if (root.children[suffix[0]]) {
      child = root.children[suffix[0]];
    } else {
      child = new SuffixTreeNode(suffix[0]);
      root.children[suffix[0]] = child;
    }

    this.addNode(child, suffix.slice(1), index);
  }

  simplify(root) {
    const newChildren = {};

    // Go through all children of the node
    for (const node of Object.values(root.children)) {
      // Recurse down to the bottom of the tree (allows for bottom-up processing)
      this.simplify(node);

      const hasIdenticalIndex = node.indexes.join(',') === root.indexes.join(',');
      // Remove the now inaccurate indexes
      delete node.indexes;

      if (hasIdenticalIndex) {
        root.suffix += node.suffix;

        // Move all children from the simplified node to the root
        for (const [childSuffix, childNode] of Object.entries(node.children))
          newChildren[childSuffix] = childNode;
      } else {
        // Unable to simplify, keep the child untouched
        newChildren[node.suffix] = node;
      }
    }

    root.children = newChildren;
  }

  findLongestRepeatingSubstring(root = this.root) {
    if (Object.keys(root.children).length === 0)
      return '';

    const suffixes = Object.values(root.children).map(node => this.findLongestRepeatingSubstring(node));
    const longestSuffix = suffixes.sort((a, b) => b.length - a.length)[0];

    return root.suffix + longestSuffix;
  }
}

module.exports = SuffixTree;
