import {readFileSync} from 'fs';

export class Dictionary {
  private wordCount: number;
  private trie: Trie;

  constructor(private words: string[]) {
    this.wordCount = 0;
    this.trie = new Trie();
    for (const word of words) {
      this.addWord(word);
    }
  }

  addWord(word: string): void {
    this.trie.addWord(word);
    this.wordCount++;
  }

  containsWord(word: string): boolean {
    return this.trie.containsWord(word);
  }

  getWordCount(): number {
    return this.wordCount;
  }

  getWordSuggestions(options: {
    word: string;
    suggestionLimit: number;
  }): string[] {
    return this.trie.getClosestWords({
      word: options.word,
      suggestionLimit: options.suggestionLimit,
    });
  }
}

class TrieNode {
  children: Map<string, TrieNode>;
  word: string | null;
  character: string;

  constructor(character: string) {
    this.children = new Map();
    this.word = null;
    this.character = character;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode('');
  }

  addWord(word: string): void {
    let currentNode = this.root;
    for (const character of word) {
      if (!currentNode.children.has(character)) {
        currentNode.children.set(character, new TrieNode(character));
      }
      currentNode = currentNode.children.get(character)!;
    }
    currentNode.word = word;
  }

  containsWord(word: string): boolean {
    let currentNode = this.root;
    for (const character of word) {
      if (!currentNode.children.has(character)) {
        return false;
      }
      currentNode = currentNode.children.get(character)!;
    }
    return currentNode.word !== null;
  }

  getClosestWords(options: {word: string; suggestionLimit: number}): string[] {
    const {word, suggestionLimit} = options;
    let currentNode = this.root;
    for (const character of word) {
      if (!currentNode.children.has(character)) {
        break;
      }
      currentNode = currentNode.children.get(character)!;
    }
    return this.getWordsFromChildren({node: currentNode, suggestionLimit});
  }

  getWordsFromChildren(options: {
    node: TrieNode;
    suggestionLimit: number;
  }): string[] {
    const {node, suggestionLimit} = options;
    const words: string[] = [];
    if (node.word !== null) {
      words.push(node.word);
    }
    node.children.forEach(child => {
      words.push(...this.getWordsFromChildren({node: child, suggestionLimit}));
    });
    if (suggestionLimit) {
      return words.slice(0, suggestionLimit);
    }
    return words;
  }
}
interface MisspelledWord {
  word: string;
  context: string;
  suggestions: string[];
}

export function parseWordsFromFile(options: {text: string}): string[] {
  return (
    options.text
      // Split on whitespace
      .split(/\s+/)
      .map(word => word.trim())
      // Trim leading/trailing punctuation
      .map(word => word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, ''))
      .filter(word => word.length > 0)
  );
}

export function isAlphaWord(word: string): boolean {
  // Is an alphabetical word if it's only letters with optional apostrophes
  return /^[a-zA-Z]+(?:'[a-zA-Z]+)*'?$/.test(word);
}

export function getMisspelledWords(options: {
  words: string[];
  dictionary: Dictionary;
  suggestionLimit: number;
}): MisspelledWord[] {
  const {words, dictionary, suggestionLimit} = options;
  const isProper = (word: string) => {
    const firstCharacter = word.at(0) || '';
    return (
      firstCharacter === firstCharacter.toUpperCase() &&
      firstCharacter !== firstCharacter.toLowerCase()
    );
  };

  const misspelledWords: MisspelledWord[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const contextStart = Math.max(0, i - 2);
    const contextEnd = Math.min(words.length, i + 3);
    const context = words.slice(contextStart, contextEnd).join(' ');
    const suggestions = dictionary.getWordSuggestions({
      word,
      suggestionLimit,
    });
    if (
      !isProper(word) &&
      (!isAlphaWord(word) || !dictionary.containsWord(word))
    ) {
      misspelledWords.push({word, context, suggestions});
    }
  }
  return misspelledWords;
}

export function readSpellCheckFile(options: {filePath: string}): string[] {
  const filePath = options.filePath;
  if (!filePath) {
    throw new Error('File to check path is required');
  }

  try {
    const content = readFileSync(filePath, 'utf-8');

    return parseWordsFromFile({text: content});
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to read input file:', error.message);
    } else {
      console.error('An unknown error occurred while reading input file');
    }
    throw error;
  }
}

export function readDictionaryFile(options: {filePath: string}): Dictionary {
  const filePath = options.filePath;
  if (!filePath) {
    throw new Error('Dictionary file path is required');
  }

  try {
    const content = readFileSync(filePath, 'utf-8');

    const words = content.split('\n').map(word => word.trim());

    return new Dictionary(words);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to read dictionary file:', error.message);
    } else {
      console.error('An unknown error occurred while reading dictionary file');
    }
    throw error;
  }
}
