import { IDictionary } from "@/models/Dictionary";
import apiClient from "./api";

export interface IDictFetchDataOptions {
  pageIndex?: number;
  pageSize?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  search?: string;
  wordTypes?: string[];
  filters?: {
    [key: string]: string | number | boolean;
  };
}

export interface IDictFetchDataResult {
  data: IDictionary[];
  page: number;
  perPage: number;
  pageCount: number;
  total: number;
}

class dictionaryService {
  get_all(options?: IDictFetchDataOptions) {
    const controller = new AbortController();
    const request = apiClient.post<IDictFetchDataResult>(
      "/dictionary/list",
      { ...options },
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  getCategory(cat: string) {
    const controller = new AbortController();
    const request = apiClient.post<IDictionary[]>(
      "/dictionary/category",
      {
        category: cat,
      },
      { signal: controller.signal },
    );

    return { request, cancel: () => controller.abort() };
  }
}

export default new dictionaryService();
