export interface ICommunityPost {
  id: string;
  content: string;
  votes: number;
  tags: string[];
  user: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
  };
  date: string;
  commentsCount?: number;
}

export interface ICommunityFilter {
  searchQuery: string;
  sortBy: "latest" | "popular" | "unanswered" | "user";
}
