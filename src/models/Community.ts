import { FieldValue, Timestamp } from "firebase/firestore";
import { IUser } from "./User";
import type { HitHighlightResult } from "instantsearch.js";

export interface ICommunityPost {
  id: string;
  content: string;
  tags?: string[];
  user: Partial<IUser>;
  date?: Timestamp | FieldValue;
  commentsCount?: number;
  votesCount?: number;
  hasBeenEdited?: boolean;
  isUpVoted?: boolean;
  _highlightResult?: HitHighlightResult | undefined;
}

export interface ICommunityComment {
  id: string;
  content: string;
  votesCount?: number;
  user: Partial<IUser>;
  date?: Timestamp | FieldValue;
  mentionedUser?: Partial<IUser> | null;
  hasBeenEdited?: boolean;
  isUpVoted?: boolean;
}

export interface ICommunityFilter {
  searchQuery: string;
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

export interface INotificationSettings {
  notificationScope: "all" | "community" | "none";
  communication_emails?: boolean | undefined;
  update_emails?: boolean | undefined;
}
