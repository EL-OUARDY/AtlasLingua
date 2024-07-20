import apiClient from "./api";

export interface ITranslationHistoryFetchDataResult {
  id: number;
  english: string;
  darija: string;
  source_language: string;
  created_at: string;
}

class historyService {
  get_history() {
    const controller = new AbortController();
    const request = apiClient.get<ITranslationHistoryFetchDataResult[]>(
      "/history",
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  delete_history(history_id: number) {
    const controller = new AbortController();
    const request = apiClient.delete(`/history/delete/${history_id}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  clear_all_history() {
    const controller = new AbortController();
    const request = apiClient.delete<ITranslationHistoryFetchDataResult[]>(
      "/history/delete_all",
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }
}

export default new historyService();
