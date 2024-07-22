import apiClient from "./api";

export interface IContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactService {
  contact(data: IContactRequest) {
    const controller = new AbortController();
    const request = apiClient.post("/contact", data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new ContactService();
