import apiClient from "./api";

export interface IFeedbackRequest {
  subject: string;
  body: string;
}

class feedbackService {
  submitFeedback(data: IFeedbackRequest) {
    const controller = new AbortController();
    const request = apiClient.post("/feedback", data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new feedbackService();
