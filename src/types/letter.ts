// Shared Letter type definition
export interface Letter {
  id: string;
  name: string;
  message: string;
  ip: string;
  createdAt: Date;
  likes?: number;
}

// Pagination metadata
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}
