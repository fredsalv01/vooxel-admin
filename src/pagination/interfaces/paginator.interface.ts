import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export interface PaginationResult<T> {
  first: number;
  last: number;
  limit: number;
  total?: number;
  data: T[];
}

export async function paginate<T>(
  data: T[],
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;

  return {
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? data.length : null,
    data,
  };
}
