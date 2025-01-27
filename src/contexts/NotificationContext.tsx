/* eslint-disable react-hooks/exhaustive-deps */
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
import { APP_NAME } from "@/shared/constants";

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
  hasNewNotifications: boolean;
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
  const [hasNewNotifications, setHasNewNotifications] =
    useState<boolean>(false);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    if (isNotificationOpen && notifications.length > 0) {
      setHasNewNotifications(false);
      localStorage.setItem(
        APP_NAME + "-last-seen-notification",
        notifications[0].id,
      );
    }
  }, [isNotificationOpen]);

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
      // Check if notifications has already been seen
      if (fetchedNotifications.length > 0) {
        const lastSeenNotificationId = localStorage.getItem(
          APP_NAME + "-last-seen-notification",
        );
        if (lastSeenNotificationId !== fetchedNotifications[0].id)
          setHasNewNotifications(true);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isAuthenticated, user]);

  function toggleNotification() {
    setIsNotificationOpen(!isNotificationOpen);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toggleNotification,
        isNotificationOpen,
        hasNewNotifications,
      }}
    >
      {children}
      <Notifications />
    </NotificationContext.Provider>
  );
}
