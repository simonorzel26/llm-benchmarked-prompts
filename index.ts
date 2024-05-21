
import fs from 'fs';
import { createPrompt } from './src/createPrompt';
import { extractData } from './src/extractData';
import { fuzzyTestAccuracy, type KnownData } from './src/fuzzyTestAccuracy';

const knownData: KnownData = {
  title: "Mock Article Title",
  author: "Mock Author Name",
  datePublished: "2024-05-21"
};

async function main() {
  const mockHTML = `
  <div itemscope itemtype="http://schema.org/Article">
    <h1 itemprop="headline">Mock Article Title</h1>
    <span itemprop="author">Mock Author Name</span>
    <time itemprop="datePublished" datetime="2024-05-21">May 21, 2024</time>
  </div>
  `;

  const prompt = createPrompt(mockHTML);
  const extractedData = await extractData(prompt);
  console.log("Extracted Data:", extractedData);

  const accuracy = fuzzyTestAccuracy(extractedData, knownData);
  console.log(`Matches: ${accuracy.matches}`);
  console.log(`Total Tokens: ${accuracy.totalTokens}`);
  console.log(`Accuracy: ${accuracy.accuracy.toFixed(2)}%`);

  // Save the results to a file
  const result = {
    extractedData,
    knownData,
    matches: accuracy.matches,
    totalTokens: accuracy.totalTokens,
    accuracy: accuracy.accuracy.toFixed(2)
  };

  fs.writeFileSync('test_comparison_data.json', JSON.stringify(result, null, 2));
}

main().catch(console.error);
