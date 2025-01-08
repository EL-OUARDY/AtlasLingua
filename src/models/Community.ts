import { FieldValue, Timestamp } from "firebase/firestore";

export interface ICommunityPost {
  id: string;
  content: string;
  votes: number;
  tags?: string[];
  user: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
  };
  date: Timestamp | FieldValue;
  commentsCount?: number;
}

export interface ICommunityComment {
  id: string;
  content: string;
  votes: number;
  user: {
    id: number;
    name: string;
    role: string;
  };
  date: Timestamp | FieldValue;
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
