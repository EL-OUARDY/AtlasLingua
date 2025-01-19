import apiClient from "./api";

export interface IHistory {
  id: number;
  english: string;
  darija: string;
  source_language: string;
  created_at: string;
  shareable_link: string;
}

interface IHistoryFetchDataResult {
  items: IHistory[];
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

class historyService {
  getHistory(page: number, perPage: number) {
    const controller = new AbortController();
    const request = apiClient.post<IHistoryFetchDataResult>(
      "/history",
      { page: page, per_page: perPage },
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
    const request = apiClient.delete<IHistory[]>("/history/delete_all", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

export default new historyService();
