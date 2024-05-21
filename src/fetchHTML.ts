import axios from 'axios';

export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw error;
  }
}
