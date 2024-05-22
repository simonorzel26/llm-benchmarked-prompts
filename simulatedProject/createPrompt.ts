export function createPrompt(html: string): string {
  return `
  Extract the following data from the HTML below:
  - Article Title
  - Author Name
  - Publication Date

  HTML content:
  ${html}

  Extracted Data:
  `;
}
