
import type { ModelType } from 'openai-gpt-token-counter';
import { Algorithms, compareStrings, tokenCountComparison } from '../src/stringTests';
import { DEFAULT_MODEL_OPENAI } from '../src/constants';

describe('String Comparison Tests', () => {
  test('Levenshtein similarity should be above 0.5', () => {
    const string1 = "kitten";
    const string2 = "sitting";
    const result = compareStrings(string1, string2, Algorithms.LEVENSHTEIN);
    expect(result.similarity).toBeGreaterThan(0.5);
  });

  test('Jaccard similarity should be above 0.4', () => {
    const string1 = "night";
    const string2 = "nacht";
    const result = compareStrings(string1, string2, Algorithms.JACCARD);
    expect(result.similarity).toBeGreaterThan(0.4);
  });

  test('Cosine similarity should be above 0.7', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.COSINE);
    expect(result.similarity).toBeGreaterThan(0.7);
  });

  test('Dice similarity should be above 0.4', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.DICE);
    expect(result.similarity).toBeGreaterThan(0.4);
  });

  test('Jaro-Winkler similarity should be above 0.8', () => {
    const string1 = "dwayne";
    const string2 = "duane";
    const result = compareStrings(string1, string2, Algorithms.JARO_WINKLER);
    expect(result.similarity).toBeGreaterThan(0.8);
  });

  test('LCS similarity should be above 0.7', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.LCS);
    expect(result.similarity).toBeGreaterThan(0.7);
  });
});

describe('Token Count Comparison test accuracy', () => {
  const testString1 = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
  
  it('should be above 0.9', () => {
    const extractedData = testString1;
    const knownData = testString1.replace('Lorem', '');
    expect(extractedData !== knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeGreaterThan(0.9);
  }); 
  it('should be 1', () => {
    const extractedData = testString1;
    const knownData = testString1;
    expect(extractedData === knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBe(1);
  });
  it('should not be 1', () => {
    const extractedData = testString1;
    const knownData = testString1.replace('Lorem', '');
    expect(extractedData !== knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).not.toBe(1);
  }); 
});
