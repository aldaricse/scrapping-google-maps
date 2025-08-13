export interface Place {
  id?: number;
  logId: number;
  searchCriteria: string;
  name: string;
  address: string;
  category: string;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  phone?: string;
  web?: string;
  link: string;
}

export interface PlaceFilters {
  page?: number;
  limit?: number;
  category?: string;
  minRating?: number;
  searchCriteria?: string;
}