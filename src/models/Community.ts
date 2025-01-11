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
}

export interface ICommunityFilter {
  searchQuery: string;
  sortBy: "latest" | "popular" | "unanswered" | "user";
}

export interface IReportPost {
  userId: number | undefined;
  postId: string;
  reasons: string[];
  description?: string | undefined;
}
