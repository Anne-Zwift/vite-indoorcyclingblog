import type { Profile } from "./Profile";

export interface ApiMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export interface ApiProfilesResponse {
  data: Profile[];
  meta: ApiMeta;
}

