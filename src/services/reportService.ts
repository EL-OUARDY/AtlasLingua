import apiClient from "./api";

export interface IReportRequest {
  translation_id?: number;
  body: string;
}

class reportService {
  submitReport(data: IReportRequest) {
    const controller = new AbortController();
    const request = apiClient.post("/report", data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new reportService();
