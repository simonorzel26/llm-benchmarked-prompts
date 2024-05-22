import type { ModelType } from "openai-gpt-token-counter";
import { tokenCount } from "./tokenize";
import stringComparison from 'string-comparison';
import { DEFAULT_MODEL_OPENAI } from "./constants";

export interface ComparisonResult {
  distance?: number;
  similarity: number;
}

export enum Algorithms {
  LEVENSHTEIN = 'levenshtein',
  JACCARD = 'jaccard',
  COSINE = 'cosine',
  DICE = 'dice',
  JARO_WINKLER = 'jaro_winkler',
  LCS = 'lcs'
}

export function tokenCountComparison(extractedData: string, knownData: string, model: ModelType = DEFAULT_MODEL_OPENAI) {
	const extractedTokens = tokenCount(extractedData, model);
	const knownTokens = tokenCount(knownData, model);

	if (extractedTokens === 0 && knownTokens === 0) {
		return { accuracy: 1 };
	}

	if (extractedTokens === 0 || knownTokens === 0) {
		return { accuracy: 0 };
	}

	const minTokens = Math.min(extractedTokens, knownTokens);
	const maxTokens = Math.max(extractedTokens, knownTokens);

	const accuracy = minTokens / maxTokens;

	return {
		accuracy: Number.parseFloat(accuracy.toFixed(4)),
	};
}



export function compareStrings(string1: string, string2: string, algorithm: Algorithms): ComparisonResult {
  let result: ComparisonResult = { similarity: 0};

  switch (algorithm) {
      case Algorithms.LEVENSHTEIN: {
          const levenshtein = stringComparison.levenshtein;
          const distance = levenshtein.distance(string1, string2);
          const similarity = levenshtein.similarity(string1, string2);
          result = {
              distance: Number.parseFloat(distance.toFixed(4)),
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      case Algorithms.JACCARD: {
          const jaccard = stringComparison.jaccardIndex;
          const similarity = jaccard.similarity(string1, string2);
          result = {
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      case Algorithms.COSINE: {
          const cosine = stringComparison.cosine;
          const similarity = cosine.similarity(string1, string2);
          result = {
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      case Algorithms.DICE: {
          const dice = stringComparison.diceCoefficient;
          const similarity = dice.similarity(string1, string2);
          result = {
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      case Algorithms.JARO_WINKLER: {
          const jaroWinkler = stringComparison.jaroWinkler;
          const similarity = jaroWinkler.similarity(string1, string2);
          result = {
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      case Algorithms.LCS: {
          const lcs = stringComparison.lcs;
          const distance = lcs.distance(string1, string2);
          const similarity = lcs.similarity(string1, string2);
          result = {
              distance: Number.parseFloat(distance.toFixed(4)),
              similarity: Number.parseFloat(similarity.toFixed(4))
          };
          break;
      }

      default:
          throw new Error("Unsupported algorithm type");
  }

  return result;
}