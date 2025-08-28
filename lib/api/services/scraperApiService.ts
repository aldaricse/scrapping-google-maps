import { Place } from "@/types/places";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function scraperPlaces(searchTerm: string): Promise<Place[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error scraping places:', error);
    throw error;
  }
}

export async function getPlaces(filters: {
  searchCriteria?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.searchCriteria) {
      queryParams.append('searchCriteria', filters.searchCriteria);
    }
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/places?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}