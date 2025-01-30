import apiClient from "./api";
import { Language } from "@/models/Translator";
import { IHistory } from "./historyService";

export interface ITranslationFetchDataRequest {
  text: string;
  source: Language;
  destination: Language;
}

export interface ITranslationData {
  translation: string;
  wordType?: string;
  verified?: boolean;
  arabic?: boolean;
}

export interface ITranslationFetchDataResult {
  id: number;
  link: string;
  translation: ITranslationData[];
}

export interface ISummarizationFetchDataRequest {
  text: string;
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

  summarize(data: ISummarizationFetchDataRequest) {
    const controller = new AbortController();
    const request = apiClient.post<string>("/summarize", data, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  transliterate(text: string) {
    const controller = new AbortController();
    const request = apiClient.post<string>(
      "/translate/transliterate",
      { text },
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  get_shared_translation(link: string) {
    const controller = new AbortController();
    const request = apiClient.get<IHistory>(`/translate/get/${link}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  stringify(translation: ITranslationData[]) {
    const result = translation.reduce((acc: string[], curr) => {
      let item = curr.translation;
      if (curr.wordType) {
        item += ` (${curr.wordType})`;
      }
      acc.push(item);
      return acc;
    }, []);

    return result.join(" | ");
  }
}

export default new translationService();
