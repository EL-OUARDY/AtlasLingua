export interface ICommunityPost {
  id: number;
  content: string;
  votes: number;
  tags: string[];
  user: {
    name: string;
    avatar: string;
    bio: string;
    role: string;
  };
  date: string;
  commentsNumber?: number;
}

export interface ICommunityFilter {
  searchQuery: string;
  sortBy: "Latest" | "Most Voted" | "Unanswered" | "My Posts";
}
