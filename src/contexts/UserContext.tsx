import { IUser } from "@/models/User";
import authService, { ILoginCredentials } from "@/services/authService";
import { CanceledError } from "axios";
import React, { ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

interface IUserContext {
  user: IUser;
  login: (credentials: ILoginCredentials) => void;
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
  const [user, setUser] = useState<IUser>({} as IUser);

  function login(credentials: ILoginCredentials) {
    const { request } = authService.login(credentials);
    request
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast("Invalid email or password. Please try again.", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      })
      .finally(() => {});
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        login: login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
