import { IUser } from "@/models/User";
import authService from "@/services/authService";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface IUserContext {
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
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

  useEffect(() => {
    const { request, cancel } = authService.getProfile();
    request
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {});

    return () => cancel();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
