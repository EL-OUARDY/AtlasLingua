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

  profile() {
    const controller = new AbortController();
    const request = apiClient.get<IUser>("/auth/profile", {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

export default new authService();
