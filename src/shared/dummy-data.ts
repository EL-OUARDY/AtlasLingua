import { ICommunityPost } from "@/models/CommunityPost";

export const dummyCommunityPosts: ICommunityPost[] = [
  {
    id: 1,
    content:
      "Just learned how to say 'Thank you' in Darija: 'Shukran'! This app is amazing for picking up everyday phrases.",
    votes: 15,
    tags: ["Phrases", "Learning"],
    user: {
      name: "Sarah Johnson",
      avatar: "https://example.com/avatars/sarah.jpg",
      bio: "English teacher exploring Moroccan culture",
      role: "Learner",
    },
    date: "2024-07-01T14:30:00Z",
    commentsNumber: 3,
  },
  {
    id: 7,
    content:
      "Quick tip: 'Inshallah' is used a lot in daily Darija conversations. It means 'God willing' or 'hopefully'.",
    votes: 25,
    tags: ["Vocabulary", "Culture"],
    user: {
      name: "Hassan Mansouri",
      avatar: "https://example.com/avatars/hassan.jpg",
      bio: "Moroccan linguistics student",
      role: "contributor",
    },
    date: "2024-06-25T10:05:00Z",
    commentsNumber: 1,
  },
  {
    id: 3,
    content:
      "Anyone know how to say 'Where is the nearest cafe?' in Darija? Planning my trip to Marrakech!",
    votes: 5,
    tags: ["Question", "Travel"],
    user: {
      name: "Emma Wilson",
      avatar: "https://example.com/avatars/emma.jpg",
      bio: "Travel enthusiast and language lover",
      role: "Learner",
    },
    date: "2024-06-29T18:45:00Z",
    commentsNumber: 5,
  },
  {
    id: 4,
    content:
      "Just added 50 new food-related phrases to the database. Enjoy learning about Moroccan cuisine!",
    votes: 22,
    tags: ["Update", "Food"],
    user: {
      name: "Fatima Zahra",
      avatar: "https://example.com/avatars/fatima.jpg",
      bio: "Moroccan chef and language enthusiast",
      role: "contributor",
    },
    date: "2024-06-28T11:20:00Z",
    commentsNumber: 4,
  },
  {
    id: 5,
    content:
      "The audio pronunciation feature is so helpful! I'm finally getting the hang of those tricky Darija sounds.",
    votes: 13,
    tags: ["Pronunciation", "Learning"],
    user: {
      name: "David Lee",
      avatar: "https://example.com/avatars/david.jpg",
      bio: "Aspiring polyglot",
      role: "Learner",
    },
    date: "2024-06-27T15:50:00Z",
    commentsNumber: 0,
  },
  {
    id: 6,
    content:
      "Suggestion: Can we add a section for Darija proverbs and their meanings? It would be great for cultural insight!",
    votes: 18,
    tags: ["Suggestion", "Proverbs"],
    user: {
      name: "Laila Bennani",
      avatar: "https://example.com/avatars/laila.jpg",
      bio: "Darija teacher and cultural expert",
      role: "contributor",
    },
    date: "2024-06-26T13:10:00Z",
    commentsNumber: 4,
  },

  {
    id: 8,
    content:
      "The difference between formal Arabic and Darija is fascinating. This app is really helping me navigate both!",
    votes: 9,
    tags: ["Observation", "Learning"],
    user: {
      name: "Anna Schmidt",
      avatar: "https://example.com/avatars/anna.jpg",
      bio: "Linguistics PhD student",
      role: "Learner",
    },
    date: "2024-06-24T16:40:00Z",
    commentsNumber: 16,
  },
  {
    id: 9,
    content:
      "Just updated the 'Transportation' category with 30 new entries. Navigating Morocco will be easier for travelers now!",
    votes: 14,
    tags: ["Update", "Travel"],
    user: {
      name: "Karim Idrissi",
      avatar: "https://example.com/avatars/karim.jpg",
      bio: "Tour guide and language enthusiast",
      role: "contributor",
    },
    date: "2024-06-23T08:55:00Z",
    commentsNumber: 9,
  },
  {
    id: 10,
    content:
      "Love the new feature that shows regional variations of phrases. Darija in Tangier vs Marrakech - so interesting!",
    votes: 20,
    tags: ["Dialect", "Learning"],
    user: {
      name: "Tom Parker",
      avatar: "https://example.com/avatars/tom.jpg",
      bio: "Expat living in Rabat",
      role: "Learner",
    },
    date: "2024-06-22T19:30:00Z",
    commentsNumber: 0,
  },
  {
    id: 2,
    content:
      "هاد الترجمة ماشي دقيقة. 'Marhaba' means 'Hello', not 'Goodbye'. Can we update this?",
    votes: 8,
    tags: ["Correction", "Vocabulary"],
    user: {
      name: "Youssef Alami",
      avatar: "https://example.com/avatars/youssef.jpg",
      bio: "Native Darija speaker from Casablanca",
      role: "contributor",
    },
    date: "2024-06-30T09:15:00Z",
    commentsNumber: 0,
  },
];

export const dummyPostComments = [
  {
    id: 101,
    content:
      "Great start, Sarah! 'Shukran' is used a lot. Try 'Baraka llahu fik' too for a more traditional Darija thanks!",
    user: {
      name: "Ahmed Benali",
    },
    date: "2024-07-01T15:00:00Z",
    votes: 26,
  },
  {
    id: 102,
    content: "This app is a game-changer for learning Darija! Keep it up!",
    user: {
      name: "Emma Thompson",
    },
    date: "2024-06-28T15:15:00Z",
    votes: 13,
  },
  {
    id: 103,
    content:
      "Pro tip: The pronunciation is more like 'shokran'. The 'u' sound is closer to 'o' in Darija.",
    user: {
      name: "Youssef Alaoui",
    },
    date: "2024-05-17T15:30:00Z",
    votes: 6,
  },
  {
    id: 104,
    content:
      "Nice! I just learned this too. It's amazing how a simple 'thank you' can brighten someone's day.",
    user: {
      name: "Lisa Chen",
    },
    date: "2024-05-01T16:00:00Z",
    votes: 3,
  },
  {
    id: 105,
    content:
      "Awesome Sarah! Next challenge: learn how to respond when someone thanks you!",
    user: {
      name: "Carlos Rodriguez",
    },
    date: "2024-04-01T16:30:00Z",
    votes: 0,
  },
];
