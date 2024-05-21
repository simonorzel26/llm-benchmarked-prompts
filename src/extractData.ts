import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
}));

export async function extractData(prompt: string): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1500,
      temperature: 0.5,
      n: 1,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error extracting data:', error);
    throw error;
  }
}