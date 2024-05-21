import { createPrompt } from '../src/createPrompt';
import { fuzzyTestAccuracy, type KnownData } from '../src/fuzzyTestAccuracy';

describe('Scraper Tests', () => {
  test('createPrompt should format prompt correctly', () => {
    const html = '<div><h1>Test Title</h1></div>';
    const prompt = createPrompt(html);
    expect(prompt).toContain(html);
    expect(prompt).toContain('Extract the following data');
  });

  test('fuzzyTestAccuracy should calculate accuracy correctly', () => {
    const extractedData = 'Title: Mock Article Title Author: Mock Author Name Published: 2024-05-21';
    const knownData: KnownData = {
      title: "Mock Article Title",
      author: "Mock Author Name",
      datePublished: "2024-05-21"
    };
    const result = fuzzyTestAccuracy(extractedData, knownData);
    expect(result.accuracy).toBe(100);
  });

  // Add more tests for fetchHTML and extractData if necessary
});
