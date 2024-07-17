import apiClient from "./api";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

class authService {
  login(credentials: ILoginCredentials) {
    const controller = new AbortController();
    const request = apiClient.post<ILoginCredentials>(
      "/auth/login",
      credentials,
      { signal: controller.signal },
    );

    return { request, cancel: () => controller.abort() };
  }

  protected() {
    const controller = new AbortController();
    const request = apiClient.get("/auth/protected", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

export default new authService();
