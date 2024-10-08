import apiClient from "./api";

export interface ITranslationHistoryFetchDataResult {
  id: number;
  english: string;
  darija: string;
  source_language: string;
  created_at: string;
  shareable_link: string;
}

class historyService {
  getHistory() {
    const controller = new AbortController();
    const request = apiClient.get<ITranslationHistoryFetchDataResult[]>(
      "/history",
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  deleteHistory(history_id: number) {
    const controller = new AbortController();
    const request = apiClient.delete(`/history/delete/${history_id}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  clearAllHistory() {
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
