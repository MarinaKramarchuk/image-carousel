import type { ImageResponse } from '../types/image';

const BASE_URL = 'https://picsum.photos/v2';

export const fetchImages = async (page = 1, limit = 30): Promise<ImageResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/list?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json() as ImageResponse;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
};