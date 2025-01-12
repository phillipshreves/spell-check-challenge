# Spell Checker Code Challenge

## Review

Enjoyed the challenge, thanks so much for the opportunity! This document is the response to the code challenge and outlines design decisions and how to use the program.

### The Features

Your program should support the following features (time permitting):

1. [X] The program outputs a list of incorrectly spelled words.
2. [X] For each misspelled word, the program outputs a list of suggested words.
3. [ ] (Not implemented) The suggested words seem sensible given the context
4. [X] The program prints the misspelled word along with some surrounding context.
5. [X] The program handles proper nouns (person or place names, for example) correctly.

## Design Decisions

### Stack

- Runtime: [node.js](https://nodejs.org/en)
- Language: [Typescript](https://www.typescriptlang.org/)
- Linter: [Google Typescript Style](https://github.com/google/gts)
- Test Framework: [Jest](https://jestjs.io/)

### Areas of Note

- This is only effective for the english alphabet.
- The requested feature "The suggested words seem sensible given the context" was not implemented as it would add have taken more time than allotted.
- Currently, the program only handles apostrophes inside a word, while other punctuation must be a part of the word in the dictionary, such as hyphens and underscores. If this was a necessary feature, we could split words based on a set of delimiters to solve this.
- The functions readDictionaryFile and readSpellCheckFromFile could use similar logic, however, the spell check file is an unknown format and so we use loose parsing to extract words, while in the dictionary file we can assume a known format and can use strict parsing which ensures that the words are valid.
- The program considers words that start with a capital letter to be proper nouns, however, it does not implement logic to determine the beginning of a sentence where any word is capitalized, and will not be able to validate those words.

## The How-To's

The following instructions are targeting a technical audience and provides commands for Linux and macOS users.

To run this program, you must have a recent version(Tested with v20 and v22) of node.js installed and available in your environment path. Installation details are out of scope of this document, please visit [node.js](https://nodejs.org/en) for installation details.

These variables will need replaced while running the commands below:

- $DICTIONARY_FILE = The file path to the file containing the list of dictionary words. 
- $INPUT_FILE = The file path to the file that needs spell checked.
- $SUGGESTION_LIMIT = Optional. The number of suggested replacements to return for misspelled words.

### Quick Start

A shell script is provided to create a one-liner that installs dependencies and runs the program for you:

```bash
./quick_start_spell_checker.sh $DICTIONARY_FILE $INPUT_FILE $SUGGESTION_LIMIT
```

Examples:

```bash
./quick_start_spell_checker.sh ./dictionary.txt ./README.md

./quick_start_spell_checker.sh ./dictionary.txt ./README.md 42
```

You may need to add executable permissions to the shell script. Depending on your operating system, it may look something like:

```bash
chmod +x ./quick_start_spell_checker.sh
```

### Manual Installation

To install the necessary dependencies, use the following command:

```bash
npm install
```

### Usage

To run the spell checker, use the following command:

```bash
npm start $DICTIONARY_FILE $INPUT_FILE $SUGGESTION_LIMIT
```

### Testing

To execute the tests, use the following command:

```bash
npm test
```
