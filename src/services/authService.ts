import { IUser } from "@/models/User";
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
    const request = apiClient.post<IUser>("/auth/login", credentials, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  register(credentials: IRegisterData) {
    const controller = new AbortController();
    const request = apiClient.post<IUser>("/auth/register", credentials, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getProfile() {
    const controller = new AbortController();
    const request = apiClient.get<IUser>("/auth/profile", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  logout() {
    const controller = new AbortController();
    const request = apiClient.post("/auth/logout", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  forgotPassword(formData: { email: string }) {
    const controller = new AbortController();
    const request = apiClient.post("/auth/forgot-password", formData, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  resetPassword(new_password: string, token: string) {
    const controller = new AbortController();
    const request = apiClient.post(
      "/auth/reset-password",
      { new_password, token },
      {
        signal: controller.signal,
      },
    );

    return { request, cancel: () => controller.abort() };
  }

  updateUser(data: Partial<IUser>) {
    const controller = new AbortController();
    const request = apiClient.post("/auth/update", data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new authService();
