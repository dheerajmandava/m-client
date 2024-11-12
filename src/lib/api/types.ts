export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
} 