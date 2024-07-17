import { IUser } from "@/models/User";
import React, { ReactNode, useContext, useState } from "react";

interface IUserContext {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
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
