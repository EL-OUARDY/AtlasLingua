import React, { ReactNode, useContext, useState } from "react";

interface IDataContext {
  isNotificationOpen: boolean;
  toggleNotification: () => void;
}

const DataContext = React.createContext<IDataContext>({} as IDataContext);

// custom hook to expose the DataContext
export function useData() {
  return useContext(DataContext);
}

interface Props {
  children: ReactNode;
}

export function DataProvider({ children }: Props) {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  function toggleNotification() {
    setIsNotificationOpen(!isNotificationOpen);
  }

  return (
    <DataContext.Provider
      value={{
        isNotificationOpen: isNotificationOpen,
        toggleNotification: toggleNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
