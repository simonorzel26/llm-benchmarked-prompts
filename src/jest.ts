import type { ModelType } from "openai-gpt-token-counter";
import { openaiApi, type Options } from "./apiAdapters";
import { DEFAULT_MODEL_OPENAI } from "./constants";
import { Algorithms, compareStrings } from "./stringTests";

export function checkForValidJson(response: string): Record<string, string | number> {
  expect(response).toBeTruthy();

  let parsedResponse = null;
  try {
    parsedResponse = JSON.parse(response);
  } catch (e) {
    console.error('Response is not a valid JSON object:', response);
    throw new Error('Response is not a valid JSON object');
  }

  expect(parsedResponse).toBeTruthy();

  return parsedResponse;
}

export async function checkPromptOutputAgainstExpectedSchema(
  prompt: string,
  schema: Record<string, string | number> = {},
  options: Options = {},
  model: ModelType = DEFAULT_MODEL_OPENAI,
): Promise<Record<string, string | number>> {
  const response = await openaiApi(prompt, options, model);

  const parsedResponse = checkForValidJson(response);

  const responseKeys = Object.keys(parsedResponse);
  const schemaKeys = Object.keys(schema);

  try {
    expect(responseKeys).toEqual(expect.arrayContaining(schemaKeys));
  } catch (e) {
    console.error('Schema mismatch:');
    console.error('Expected keys:', schemaKeys);
    console.error('Received keys:', responseKeys);
    throw e;
  }

  return parsedResponse;
}

export async function compareAllKeysAgainstSchema(
  prompt: string,
  schema: Record<string, string | number> = {},
  options: Options = {},
  model: ModelType = DEFAULT_MODEL_OPENAI,
  comparisonAlgorithm: Algorithms = Algorithms.LEVENSHTEIN,
  similarityThreshold = 0.7
): Promise<void> {

  const parsedResponse = await checkPromptOutputAgainstExpectedSchema(prompt, schema, options, model);

  for (const key of Object.keys(schema)) {
    const schemaValue = schema[key];
    const responseValue = parsedResponse[key];

    const schemaValueStr = String(schemaValue);
    const responseValueStr = String(responseValue);

    const comparisonResult = compareStrings(schemaValueStr, responseValueStr, comparisonAlgorithm);

    console.log(`Comparing key "${key}": Schema value "${schemaValueStr}" vs. Response value "${responseValueStr}"`);
    console.log(`Similarity: ${comparisonResult.similarity}`);

    try {
      expect(comparisonResult.similarity).toBeGreaterThanOrEqual(similarityThreshold);
    } catch (e) {
      console.error(`Similarity for key "${key}" is below the threshold (${similarityThreshold}):`);
      console.error(`Schema value: "${schemaValueStr}"`);
      console.error(`Response value: "${responseValueStr}"`);
      console.error(`Similarity: ${comparisonResult.similarity}`);
      throw e;
    }
  }
}

