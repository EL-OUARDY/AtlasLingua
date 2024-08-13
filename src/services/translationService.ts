import apiClient from "./api";
import { Language } from "@/models/Translator";

export interface ITranslationFetchDataRequest {
  text: string;
  source: Language;
  destination: Language;
}

export interface ITranslationData {
  translation: string;
  wordType?: string;
  verified?: boolean;
}

export interface ITranslationFetchDataResult {
  id: number;
  link: string;
  translation: ITranslationData[];
}

class translationService {
  translate(data: ITranslationFetchDataRequest) {
    const controller = new AbortController();
    const request = apiClient.post<ITranslationFetchDataResult>(
      "/translate",
      data,
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }
}

export default new translationService();
