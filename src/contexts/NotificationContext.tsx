import Notifications from "@/components/Notifications";
import React, { ReactNode, useContext, useState } from "react";

interface INotificationContext {
  isNotificationOpen: boolean;
  toggleNotification: () => void;
}

const NotificationContext = React.createContext<INotificationContext>(
  {} as INotificationContext,
);

// custom hook to expose the NotificationContext
export function useNotification() {
  return useContext(NotificationContext);
}

interface Props {
  children: ReactNode;
}

export function NotificationProvider({ children }: Props) {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  function toggleNotification() {
    setIsNotificationOpen(!isNotificationOpen);
  }

  return (
    <NotificationContext.Provider
      value={{
        isNotificationOpen: isNotificationOpen,
        toggleNotification: toggleNotification,
      }}
    >
      {children}
      <Notifications />
    </NotificationContext.Provider>
  );
}
