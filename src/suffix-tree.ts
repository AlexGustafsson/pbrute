/**
* A node of a Suffix Tree.
*/
export class SuffixTreeNode {
  suffix: string
  children: {[key: string]: SuffixTreeNode}
  indices: number[]

  /**
  * Create an empty node.
  * @param suffix - The suffix the node is for.
  */
  constructor(suffix: string) {
    this.suffix = suffix;
    this.children = {};
    this.indices = [];
  }
}

/**
* A Suffix Tree (https://en.wikipedia.org/wiki/Suffix_tree) implementation
* for providing fast string operations.
*/
export default class SuffixTree {
  /** The entire text of the tree. */
  text: string
  /** The root of the tree. */
  root: SuffixTreeNode

  /**
  * Create a Suffix Tree.
  * @param text - The text for which to create the tree.
  */
  constructor(text: string) {
    this.text = text;
    this.root = new SuffixTreeNode("");

    // Add a node for each character in the text
    for (let index = 0; index < text.length; index++) {
      const suffix = text.slice(index);
      this.addNode(this.root, suffix, index);
    }

    this.simplify(this.root);
  }

  /**
  * Add a node to the tree.
  * @param root - The root from the node's point of view.
  * @param suffix - The part of the full text to add a node for.
  * @param index - The index of the character in the full text.
  */
  private addNode(root: SuffixTreeNode, suffix: string, index: number) {
    root.indices.push(index);

    if (suffix === "")
      return;

    const character = suffix[0];

    // Get the already existing child node for the character or create a new one
    const child = root.children[character] || new SuffixTreeNode(character);
    root.children[character] = child;

    // Recurse over the next part of the suffix
    this.addNode(child, suffix.slice(1), index);
  }

  /**
  * Simplify the tree.
  * @param root - The node to start at.
  */
  private simplify(root: SuffixTreeNode) {
    const newChildren: {[key: string]: SuffixTreeNode} = {};

    // Go through all children of the node
    for (const node of Object.values(root.children)) {
      // Recurse down to the bottom of the tree (allows for bottom-up processing)
      this.simplify(node);

      const hasIdenticalIndex = node.indices.join(",") === root.indices.join(",");
      // Remove the now inaccurate indexes
      // delete node.indices;

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

  /**
  * Find the longest repeating substring of the tree.
  * @param root - Optional node to start from. Defaults to the tree's root.
  * @returns The the longest repeating substring.
  */
  findLongestRepeatingSubstring(root = this.root): string {
    if (Object.keys(root.children).length === 0)
      return "";

    const suffixes = Object.values(root.children).map((node: SuffixTreeNode) => this.findLongestRepeatingSubstring(node));
    const longestSuffix = suffixes.sort((a, b) => b.length - a.length)[0];

    return root.suffix + longestSuffix;
  }
}
