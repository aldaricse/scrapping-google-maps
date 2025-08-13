export interface ScrappingLog {
  id: number;
  searchQuery: string;
  status: "pending" | "in_progress" | "completed" | "failed" | string;
  processedCount?: number;
  errorMessage?: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  places?: Place[];
}