import { ScrappingLog } from "@/types/scrappingLog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getScrappingLogs(): Promise<ScrappingLog[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scrapping-logs`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching scrapping logs:', error);
    return [];
  }
}

export async function createScrappingLog(log: Omit<ScrappingLog, 'id' | 'createdAt'>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scrapping-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating scrapping log:', error);
    throw error;
  }
}