export interface ScrappingLog {
  id: string;
  searchQuery: string;
  resultsCount: number;
  status: 'success' | 'error' | 'pending';
  createdAt: Date;
  updatedAt?: Date;
  errorMessage?: string;
}