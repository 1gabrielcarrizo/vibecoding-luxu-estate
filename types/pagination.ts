import { Property } from "./property";

export interface PaginationResult {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PropertyFilterParams {
  page?: number;
  pageSize?: number;
  category?: string;
  type?: string; // 'All' | 'Buy' | 'Rent' or 'sale' | 'rent'
  query?: string;
}
