import apiClient from "./api";
import { Language } from "@/models/Translator";

export interface ITranslationFetchDataRequest {
  text: string;
  source: Language;
  destination: Language;
}

export interface ITranslationFetchDataResult {
  translation: string;
  wordType: string;
  verified: boolean;
}

class translationService {
  translate(data: ITranslationFetchDataRequest) {
    const controller = new AbortController();
    const request = apiClient.post<ITranslationFetchDataResult[]>(
      "/translation/translate",
      data,
      { signal: controller.signal },
    );

    return { request, cancel: () => controller.abort() };
  }
}

export default new translationService();
