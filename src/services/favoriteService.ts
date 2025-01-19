import apiClient from "./api";

export interface IFavorite {
  id?: number;
  english: string;
  darija: string;
  arabic?: string;
  word_type?: string;
  verified?: boolean;
  created_at?: string;
}

interface IFavoriteResponse {
  favorites: IFavorite[];
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

class FavoriteService {
  getFavorites(searchQuery: string, page: number, perPage: number) {
    const controller = new AbortController();
    const request = apiClient.post<IFavoriteResponse>(
      "/favorite/list",
      { search: searchQuery, page: page, per_page: perPage },
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  addFavorite(data: IFavorite) {
    const controller = new AbortController();
    const request = apiClient.post<number>("/favorite/add", data, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  addFavoriteFromDictionary(dict_id: number) {
    const controller = new AbortController();
    const request = apiClient.post(
      "/favorite/add-from-dictionary",
      { id: dict_id },
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  removeDictionaryFavorite(dict_id: number) {
    const controller = new AbortController();
    const request = apiClient.delete(`/favorite/remove-dictionary/${dict_id}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  deleteFavorite(favorite_id: number) {
    const controller = new AbortController();
    const request = apiClient.delete(`/favorite/delete/${favorite_id}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

export default new FavoriteService();
