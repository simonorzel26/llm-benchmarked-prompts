import type { ModelType } from "openai-gpt-token-counter";
import { DEFAULT_MODEL_OPENAI } from "./constants";
import OpenAI from "openai";
import type {
	CompletionCreateParamsBase,
	Completion,
} from "openai/resources/completions.mjs";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export interface Options extends Partial<CompletionCreateParamsBase> {}

export async function openaiApi(
	prompt: string,
	options: Options = {},
	model: ModelType = DEFAULT_MODEL_OPENAI,
): Promise<string> {
	try {
		const response = await openai.completions.create({
			model: model,
			prompt: prompt,
			...options,
		});

		if ("choices" in response) {
			return (response as Completion).choices[0].text.trim();
		}
		throw new Error("Unexpected response type");
	} catch (error) {
		console.error("Error extracting data:", error);
		throw error;
	}
}
