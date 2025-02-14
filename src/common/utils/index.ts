import axios from 'axios';

export async function isUrlReachable(url: string): Promise<boolean> {
  try {
    new URL(url);

    const response = await axios.head(url, { timeout: 5000 });
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    console.error(`URL validation failed for ${url}:`, error.message);
    return false;
  }
}
