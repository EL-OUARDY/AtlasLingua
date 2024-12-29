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
  date: string;
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
  date: string;
}

export interface ICommunityFilter {
  searchQuery: string;
  sortBy: "latest" | "popular" | "unanswered" | "user";
}
