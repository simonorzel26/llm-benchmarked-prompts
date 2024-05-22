
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

  test('Levenshtein similarity should be 1 for identical strings', () => {
    const string1 = "kitten";
    const string2 = "kitten";
    const result = compareStrings(string1, string2, Algorithms.LEVENSHTEIN);
    expect(result.similarity).toBe(1);
  });

  test('Levenshtein similarity should be 0 for completely different strings', () => {
    const string1 = "kitten";
    const string2 = "puppy";
    const result = compareStrings(string1, string2, Algorithms.LEVENSHTEIN);
    expect(result.similarity).toBeLessThan(0.2);
  });

  test('Jaccard similarity should be above 0.4', () => {
    const string1 = "night";
    const string2 = "nacht";
    const result = compareStrings(string1, string2, Algorithms.JACCARD);
    expect(result.similarity).toBeGreaterThan(0.4);
  });

  test('Jaccard similarity should be 1 for identical strings', () => {
    const string1 = "night";
    const string2 = "night";
    const result = compareStrings(string1, string2, Algorithms.JACCARD);
    expect(result.similarity).toBe(1);
  });

  test('Jaccard similarity should be 0 for completely different strings', () => {
    const string1 = "night";
    const string2 = "day";
    const result = compareStrings(string1, string2, Algorithms.JACCARD);
    expect(result.similarity).toBeLessThan(0.2);
  });

  test('Cosine similarity should be above 0.7', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.COSINE);
    expect(result.similarity).toBeGreaterThan(0.7);
  });

  test('Cosine similarity should be 1 for identical strings', () => {
    const string1 = "context";
    const string2 = "context";
    const result = compareStrings(string1, string2, Algorithms.COSINE);
    expect(result.similarity).toBe(1);
  });

  test('Cosine similarity should be less than 0.3 for completely different strings', () => {
    const string1 = "context";
    const string2 = "apple";
    const result = compareStrings(string1, string2, Algorithms.COSINE);
    expect(result.similarity).toBeLessThan(0.3);
  });

  test('Dice similarity should be above 0.4', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.DICE);
    expect(result.similarity).toBeGreaterThan(0.4);
  });

  test('Dice similarity should be 1 for identical strings', () => {
    const string1 = "context";
    const string2 = "context";
    const result = compareStrings(string1, string2, Algorithms.DICE);
    expect(result.similarity).toBe(1);
  });

  test('Dice similarity should be less than 0.3 for completely different strings', () => {
    const string1 = "context";
    const string2 = "banana";
    const result = compareStrings(string1, string2, Algorithms.DICE);
    expect(result.similarity).toBeLessThan(0.3);
  });

  test('Jaro-Winkler similarity should be above 0.8', () => {
    const string1 = "dwayne";
    const string2 = "duane";
    const result = compareStrings(string1, string2, Algorithms.JARO_WINKLER);
    expect(result.similarity).toBeGreaterThan(0.8);
  });

  test('Jaro-Winkler similarity should be 1 for identical strings', () => {
    const string1 = "dwayne";
    const string2 = "dwayne";
    const result = compareStrings(string1, string2, Algorithms.JARO_WINKLER);
    expect(result.similarity).toBe(1);
  });

  test('Jaro-Winkler similarity should be less than 0.6 for completely different strings', () => {
    const string1 = "dwayne";
    const string2 = "apple";
    const result = compareStrings(string1, string2, Algorithms.JARO_WINKLER);
    expect(result.similarity).toBeLessThan(0.6);
  });

  test('LCS similarity should be above 0.7', () => {
    const string1 = "context";
    const string2 = "contact";
    const result = compareStrings(string1, string2, Algorithms.LCS);
    expect(result.similarity).toBeGreaterThan(0.7);
  });

  test('LCS similarity should be 1 for identical strings', () => {
    const string1 = "context";
    const string2 = "context";
    const result = compareStrings(string1, string2, Algorithms.LCS);
    expect(result.similarity).toBe(1);
  });

  test('LCS similarity should be less than 0.3 for completely different strings', () => {
    const string1 = "context";
    const string2 = "banana";
    const result = compareStrings(string1, string2, Algorithms.LCS);
    expect(result.similarity).toBeLessThan(0.3);
  });
});


describe('Token Count Comparison test accuracy', () => {
  const testString1 = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
  const testString2 = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.";
  const testString3 = "Lorem ipsum dolor sit amet.";
  const testString4 = "";
  const testString5 = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.";

  it('should be above 0.9 for similar strings', () => {
    const extractedData = testString1;
    const knownData = testString1.replace('Lorem', 'Lorem');
    expect(extractedData === knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeGreaterThan(0.9);
  });

  it('should be 1 for identical strings', () => {
    const extractedData = testString1;
    const knownData = testString1;
    expect(extractedData === knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBe(1);
  });

  it('should not be 1 for strings with minor differences', () => {
    const extractedData = testString1;
    const knownData = testString1.replace('Lorem', '');
    expect(extractedData !== knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).not.toBe(1);
  });

  it('should be lower for partially matching strings', () => {
    const extractedData = testString1;
    const knownData = testString2;
    expect(extractedData as string !== knownData as string).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeLessThan(0.9);
  });

  it('should handle completely different strings', () => {
    const extractedData = testString1;
    const knownData = testString3;
    expect(extractedData as string !== knownData as string).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeLessThan(0.5);
  });

  it('should handle both empty strings', () => {
    const extractedData = testString4;
    const knownData = testString4;
    expect(extractedData === knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBe(1);
  });

  it('should handle one empty and one non-empty string', () => {
    const extractedData = testString1;
    const knownData = testString4;
    expect(extractedData.length !== knownData.length).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBe(0);
  });

  it('should handle strings with different lengths', () => {
    const extractedData = testString2;
    const knownData = testString5;
    expect(extractedData.length !== knownData.length).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeLessThan(1);
  });

  it('should handle identical strings with varying white spaces', () => {
    const extractedData = testString1;
    const knownData = testString1.replace(/\s+/g, ' ');

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBeGreaterThan(0.9);
  });

  it('should handle strings with special characters', () => {
    const extractedData = `${testString1} @#$%^&*()`;
    const knownData = `${testString1} @#$%^&*()`;
    expect(extractedData === knownData).toBeTruthy();

    const result = tokenCountComparison(extractedData, knownData, DEFAULT_MODEL_OPENAI as ModelType);
    console.log('Accuracy: ', result.accuracy);
    expect(result.accuracy).toBe(1);
  });
});
