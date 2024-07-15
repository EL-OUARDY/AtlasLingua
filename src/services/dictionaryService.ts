import { IDictionary } from "@/models/Dictionary";
import apiClient from "./api";

class dictionaryService {
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
