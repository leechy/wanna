import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid';

const getVowels = customAlphabet('aeiou', 7);
const getConsonants = customAlphabet('bdfgjklmnpqrstvz', 14);

/**
 * Function to generate human readable ids
 * it takes two nanoid strings: one with 6 vowels and one with 12 consonants
 * and creates 6 groups of 3 characters each: one vowel and two consonants
 * these three characters are then shuffled and joined with a dash
 */
export function getHRID(): string {
  const vowels = getVowels();
  const consonants = getConsonants();

  const groups = Array.from({ length: 7 }, (_, i) => {
    return consonants[i * 2] + vowels[i] + consonants[i * 2 + 1];
    // const vowel = vowels[i];
    // const consonant1 = consonants[i * 2];
    // const consonant2 = consonants[i * 2 + 1];
    // return [vowel, consonant1, consonant2].sort(() => Math.random() - 0.5).join('');
  });

  return groups.join('-');
}
