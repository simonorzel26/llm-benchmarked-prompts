import { test, expect, mock } from "bun:test";
import { checkForValidJson, checkPromptOutputAgainstExpectedSchema, compareAllKeysAgainstSchema } from '../src/jest';
import { DEFAULT_MODEL_OPENAI } from '../src/constants';
import { Algorithms, compareStrings } from '../src/stringTests';

// Mocking the openaiApi module
const openaiApi = mock(() => Promise.resolve('{"key": "value", "number": 123}'));
mock.module('../src/apiAdapters', () => ({
  openaiApi,
}));

// Mocking the compareStrings function
mock.module('../src/stringTests', () => ({
  Algorithms: {
    LEVENSHTEIN: 'LEVENSHTEIN',
  },
  compareStrings: mock(() => ({ similarity: 0.9 })),
}));

test('checkForValidJson should parse valid JSON response correctly', () => {
  const response = '{"key": "value", "number": 123}';
  const result = checkForValidJson(response);
  expect(result).toEqual({ key: 'value', number: 123 });
});

test('checkForValidJson should throw an error for invalid JSON response', () => {
  const response = '{key: value, number: 123}';
  expect(() => checkForValidJson(response)).toThrow('Response is not a valid JSON object');
});

test('checkPromptOutputAgainstExpectedSchema should validate response against schema successfully', async () => {
  const prompt = 'test prompt';
  const schema = { key: 'value', number: 123 };
  const options = {};
  const model = DEFAULT_MODEL_OPENAI;

  openaiApi.mockImplementationOnce(() => Promise.resolve('{"key": "value", "number": 123}'));

  const result = await checkPromptOutputAgainstExpectedSchema(prompt, schema, options, model);
  expect(result).toEqual({ key: 'value', number: 123 });
});

test('checkPromptOutputAgainstExpectedSchema should throw an error when response does not match schema', async () => {
  const prompt = 'test prompt';
  const schema = { key: 'value', number: 123 };
  const options = {};
  const model = DEFAULT_MODEL_OPENAI;

  openaiApi.mockImplementationOnce(() => Promise.resolve('{"key": "value"}'));

  await expect(checkPromptOutputAgainstExpectedSchema(prompt, schema, options, model)).rejects.toThrow();
});

test('checkPromptOutputAgainstExpectedSchema should throw an error for invalid JSON response', async () => {
  const prompt = 'test prompt';
  const schema = { key: 'value', number: 123 };
  const options = {};
  const model = DEFAULT_MODEL_OPENAI;

  openaiApi.mockImplementationOnce(() => Promise.resolve('{key: value}'));

  await expect(checkPromptOutputAgainstExpectedSchema(prompt, schema, options, model)).rejects.toThrow('Response is not a valid JSON object');
});

test('compareAllKeysAgainstSchema should compare all keys against schema and pass similarity check', async () => {
  const prompt = 'test prompt';
  const schema = { key: 'value', number: 123 };
  const options = {};
  const model = DEFAULT_MODEL_OPENAI;
  const similarityThreshold = 0.7;

  openaiApi.mockImplementationOnce(() => Promise.resolve('{"key": "value", "number": 123}'));
  compareStrings.mockImplementationOnce(() => ({ similarity: 0.9 }));

  await compareAllKeysAgainstSchema(prompt, schema, options, model, Algorithms.LEVENSHTEIN, similarityThreshold);
  expect(compareStrings).toHaveBeenCalled();
});

test('compareAllKeysAgainstSchema should throw an error when similarity is below threshold', async () => {
  const prompt = 'test prompt';
  const schema = { key: 'value', number: 123 };
  const options = {};
  const model = DEFAULT_MODEL_OPENAI;
  const similarityThreshold = 0.7;

  openaiApi.mockImplementationOnce(() => Promise.resolve('{"key": "value", "number": 123}'));
  compareStrings.mockImplementationOnce(() => ({ similarity: 0.5 }));

  await expect(compareAllKeysAgainstSchema(prompt, schema, options, model, Algorithms.LEVENSHTEIN, similarityThreshold)).rejects.toThrow();
});
