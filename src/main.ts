#!/usr/bin/env node

import {
  getMisspelledWords,
  readDictionaryFile,
  readSpellCheckFile,
} from './spell-checker';

function main() {
  console.log('Spell Checker started.');
  console.time('Spell Checker');

  const dictionaryPath = process.argv[2];
  const fileToCheckPath = process.argv[3];
  const suggestionLimit = Number(process.argv[4]);

  if (!dictionaryPath) {
    console.log(
      'No dictionary file path provided, please provide a dictionary file',
    );
    throw new Error('No dictionary path provided');
  }
  if (!fileToCheckPath) {
    console.log(
      'No file-to-check path provided, please provide a file to check',
    );
    throw new Error('No file-to-check path provided');
  }

  const dictionary = readDictionaryFile({filePath: dictionaryPath});
  console.log(`Using dictionary with ${dictionary.getWordCount()} words.`);
  const wordsToCheck = readSpellCheckFile({filePath: fileToCheckPath});
  console.log(`Spell checking ${wordsToCheck.length} words.`);
  const misspelledWords = getMisspelledWords({
    words: wordsToCheck,
    dictionary,
    suggestionLimit,
  });
  console.log(`Found ${misspelledWords.length} misspelled words:`);
  console.log('--------------------------------');

  misspelledWords.forEach(word => {
    console.log('--------------------------------');
    console.log(`Misspelled Word: ${word.word}`);
    console.log(`Context: ${word.context}`);
    console.log(`Suggested Replacements: ${word.suggestions.join(', ')}`);
  });

  console.log('--------------------------------');
  console.log('Spell Checker finished.');
  console.timeEnd('Spell Checker');
}

main();
