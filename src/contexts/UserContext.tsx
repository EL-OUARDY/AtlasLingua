import { getCookie } from "@/lib/utils";
import { IUser } from "@/models/User";
import apiClient, { axiosConfig } from "@/services/api";
import authService from "@/services/authService";
import axios, { CanceledError } from "axios";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "@/services/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

interface IUserContext {
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
  isAuthenticated: boolean;
}

const UserContext = React.createContext<IUserContext>({} as IUserContext);

// custom hook to expose the UserContext
export function useUser() {
  return useContext(UserContext);
}

interface Props {
  children: ReactNode;
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<IUser | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error instanceof CanceledError) return Promise.reject(error);

        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // try to refresh the access token
          axiosConfig.headers["X-CSRF-TOKEN"] =
            getCookie("csrf_refresh_token") || "";
          const request = axios.create(axiosConfig).post("/auth/refresh");
          request
            .then(() => {
              // recall the original request with the new token
              return axios(originalRequest).then((response) => {
                if (response.config.url === "/auth/profile") {
                  setUser(response.data);
                }
              });
            })
            .catch(() => {});
        }
        return Promise.reject(error);
      },
    );
  }, []);

  // Authenticate the user and get user's profile info
  useEffect(() => {
    const { request, cancel } = authService.getProfile();
    request
      .then(({ data }) => {
        setUser(data);
        // Authenticate the user with Firebase
        if (data.firebase_token) {
          signInWithCustomToken(auth, data.firebase_token);
        }
      })
      .catch(() => {});

    return () => cancel();
  }, []);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
