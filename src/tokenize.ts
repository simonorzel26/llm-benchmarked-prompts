import openaiTokenCounter, { type ModelType } from 'openai-gpt-token-counter';
import { DEFAULT_MODEL_OPENAI } from './constants';

export function tokenCount(text: string, model: ModelType = DEFAULT_MODEL_OPENAI): number {
  return openaiTokenCounter.text(text, model);
}