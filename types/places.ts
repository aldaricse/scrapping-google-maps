export interface Place {
  id: string;
  name: string;
  address: string;
  phone?: string;
  web?: string;
  category: string;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  searchCriteria?: string;
}

export interface PlaceFilters {
  searchCriteria?: string;
  page: number;
  limit: number;
}

export interface PaginationData {
  total: number;
  pages: number;
  current: number;
  hasNext: boolean;
  hasPrevious: boolean;
}