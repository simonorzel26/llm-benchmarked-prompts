import { tokenize } from './tokenize';

export interface KnownData {
  title: string;
  author: string;
  datePublished: string;
}

export function fuzzyTestAccuracy(extractedData: string, knownData: KnownData) {
  const extractedTokens = tokenize(extractedData);
  const knownTokens = tokenize(`Title: ${knownData.title} Author: ${knownData.author} Published: ${knownData.datePublished}`);

  const matches = extractedTokens.filter(token => knownTokens.includes(token)).length;
  const totalTokens = knownTokens.length;

  return {
    matches,
    totalTokens,
    accuracy: (matches / totalTokens) * 100
  };
}
