import openaiTokenCounter, { type ModelType } from 'openai-gpt-token-counter';

export function tokenize(text: string, model: ModelType = "gpt-3.5-turbo"): number {
  return openaiTokenCounter.text(text, model);
}