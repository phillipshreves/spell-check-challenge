import {
  Dictionary,
  parseWordsFromFile,
  isAlphaWord,
  getMisspelledWords,
} from '../src/spell-checker';

describe('Dictionary', () => {
  let dictionary: Dictionary;

  beforeEach(() => {
    dictionary = new Dictionary(['hello', 'world', 'test', 'example']);
  });

  it('should return correct size', () => {
    expect(dictionary.getWordCount()).toBe(4);
  });

  it('should check if word exists', () => {
    expect(dictionary.containsWord('hello')).toBe(true);
    expect(dictionary.containsWord('HELLO')).toBe(false);
    expect(dictionary.containsWord('nonexistent')).toBe(false);
  });
});

describe('Word parsing and validation', () => {
  describe('parseWordsFromFile', () => {
    it('should parse words from text', () => {
      const text = 'Hello, world! This is a test.';
      const words = parseWordsFromFile({text});
      expect(words).toEqual(['Hello', 'world', 'This', 'is', 'a', 'test']);
    });

    it('should handle multiple spaces and punctuation', () => {
      const text = '  Hello,   world!!!  \n\t Test...  ';
      const words = parseWordsFromFile({text});
      expect(words).toEqual(['Hello', 'world', 'Test']);
    });
  });

  describe('isWord', () => {
    it('should validate words correctly', () => {
      expect(isAlphaWord('hello')).toBe(true);
      expect(isAlphaWord("don't")).toBe(true);
      expect(isAlphaWord("hasn't")).toBe(true);
      expect(isAlphaWord('123')).toBe(false);
      expect(isAlphaWord('hello!')).toBe(false);
      expect(isAlphaWord('')).toBe(false);
    });
  });
});

describe('Spell checking', () => {
  let dictionary: Dictionary;

  beforeEach(() => {
    dictionary = new Dictionary(['hello', 'world', 'test', 'example']);
  });

  it('should detect misspelled words', () => {
    const words = ['hello', 'wrld', 'test', 'exampl'];
    const misspelled = getMisspelledWords({
      words,
      dictionary,
      suggestionLimit: 1000000,
    });
    expect(misspelled).toEqual([
      {word: 'wrld', context: 'hello wrld test exampl', suggestions: ['world']},
      {word: 'exampl', context: 'wrld test exampl', suggestions: ['example']},
    ]);
  });

  it('should handle proper nouns', () => {
    const words = ['Hello', 'John', 'world'];
    const misspelled = getMisspelledWords({
      words,
      dictionary,
      suggestionLimit: 1000000,
    });
    expect(misspelled).toEqual([]);
  });

  it('should detect non-words', () => {
    const words = ['hello123', 'test!', '@world'];
    const misspelled = getMisspelledWords({
      words,
      dictionary,
      suggestionLimit: 1000000,
    });
    expect(misspelled).toEqual([
      {
        word: 'hello123',
        context: 'hello123 test! @world',
        suggestions: ['hello'],
      },
      {word: 'test!', context: 'hello123 test! @world', suggestions: ['test']},
      {
        word: '@world',
        context: 'hello123 test! @world',
        suggestions: ['hello', 'world', 'test', 'example'],
      },
    ]);
  });
});
