class TrieNode {
  HashMap <Character, Node> children
  boolean isCompleteWord
}

export default class Trie {
  Nodes: Array<TrieNode>;
  
}

/**
 * Why use a trie vs a graph data type?
 * 
 * graph operation for trie would be intersection of input / sequence and expected graph.
 * one reason is that this is only a directed graph.
 * so its a tree.
 * 
 * so quetion is why trie and not tree?
 */