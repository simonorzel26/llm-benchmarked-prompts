Sure! Here's a concise README documenting the project, its purpose, and the usage instructions:

## README

# OpenAI Scraper

A scraper that uses OpenAI to extract structured data from HTML. This project is designed to test prompts and prompt returns specifically for web scraping purposes that target structured data (ld+json) and microdata.

## Project Structure

```
openai-scraper/
├── __tests__/
│   └── scraper.test.ts
├── src/
│   ├── fetchHTML.ts
│   ├── createPrompt.ts
│   ├── extractData.ts
│   ├── tokenize.ts
│   ├── fuzzyTestAccuracy.ts
│   └── index.ts
├── index.ts
├── bunfig.toml
├── tsconfig.json
├── jest.config.js
├── .gitignore
├── README.md
└── test_comparison_data.json
```

## Installation

### Prerequisites

- Node.js (Bun preferred)
- TypeScript

### Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd openai-scraper
```

2. Install dependencies:

```bash
bun install
```

## Usage

### Main Script

The main script fetches HTML content, creates a prompt, extracts data using OpenAI, and performs fuzzy testing for accuracy.

#### index.ts

```typescript
import { fetchHTML } from './src/fetchHTML';
import { createPrompt } from './src/createPrompt';
import { extractData } from './src/extractData';
import { fuzzyTestAccuracy, KnownData } from './src/fuzzyTestAccuracy';
import fs from 'fs';

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
```

### Testing

Run tests using Jest to verify the functionality.

#### __tests__/scraper.test.ts

```typescript
import { createPrompt } from '../src/createPrompt';
import { fuzzyTestAccuracy, KnownData } from '../src/fuzzyTestAccuracy';

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
```

Run the tests:

```bash
bun test
```

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

---

This README provides an overview of the project, installation steps, usage instructions, and testing guidelines. You can customize and expand it as needed based on your project's requirements.