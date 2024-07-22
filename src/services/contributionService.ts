import apiClient from "./api";

export interface IContributionRequest {
  contribution_type: string;
  description: string;
  links: string;
}

class ContributionService {
  submitContribution(data: IContributionRequest) {
    const controller = new AbortController();
    const request = apiClient.post("/contribution", data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new ContributionService();
