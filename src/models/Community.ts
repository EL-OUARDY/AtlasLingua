import { FieldValue, Timestamp } from "firebase/firestore";
import { IUser } from "./User";

export interface ICommunityPost {
  id: string;
  content: string;
  votes: number;
  tags?: string[];
  user: Partial<IUser>;
  date: Timestamp | FieldValue;
  commentsCount?: number;
  hasBeenEdited?: boolean;
}

export interface ICommunityComment {
  id: string;
  content: string;
  votes: number;
  user: Partial<IUser>;
  date: Timestamp | FieldValue;
  mentionedUser?: string;
  hasBeenEdited?: boolean;
}

export interface ICommunityFilter {
  sortBy: "latest" | "popular" | "unanswered" | "user";
}

export enum SortOption {
  Latest = "latest",
  Popular = "popular",
  Unanswered = "unanswered",
  User = "user",
}

export interface IReportPost {
  userId: number | undefined;
  postId: string;
  reasons: string[];
  description?: string | undefined;
}
