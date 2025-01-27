import Notifications from "@/components/Notifications";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "@/services/firebaseConfig";
import { useLocation } from "react-router-dom";

export type INotificationType =
  | "new_comment"
  | "new_mention"
  | "new_feature"
  | "alert"
  | "communication";
export interface INotification {
  id: string;
  userId: number;
  type: INotificationType;
  body: string;
  link: string;
  date: Timestamp;
}

interface INotificationContext {
  notifications: INotification[];
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
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useUser();

  const location = useLocation();

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    // Get notifications
    // Reference to notifications collection
    const notificationsRef = collection(db, "notifications");

    // Get timestamp for one month ago
    const oneMonthAgo = Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    );

    // Create query with filters
    const q = query(
      notificationsRef,
      where("date", ">=", oneMonthAgo),
      where("userId", "in", [user.id, -1]), // Get user's notifications and global ones
      orderBy("date", "desc"),
      limit(20),
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as INotification[];

      setNotifications(fetchedNotifications);
      console.log(fetchedNotifications);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Close notification popup every time the URL changes
    setIsNotificationOpen(false);
  }, [location]);

  function toggleNotification() {
    setIsNotificationOpen(!isNotificationOpen);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toggleNotification,
        isNotificationOpen,
      }}
    >
      {children}
      <Notifications />
    </NotificationContext.Provider>
  );
}
