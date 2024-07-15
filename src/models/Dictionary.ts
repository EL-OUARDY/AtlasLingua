export interface IDictionary {
  id: number;
  english: string;
  darija: string;
  arabic: string;
  word_type:
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "pronoun ";
  category:
    | "family"
    | "education"
    | "clothes"
    | "food"
    | "colors"
    | "sports"
    | "numbers"
    | "health"
    | "animals"
    | "places"
    | "religion"
    | "time"
    | "emotions"
    | "environment"
    | "economy"
    | "professions"
    | "body"
    | "plants"
    | "art"
    | null;
  verified: boolean;
  favorite?: boolean;
  date?: string;
}

export const CATEGORIES: string[] = [
  "family",
  "education",
  "clothes",
  "food",
  "colors",
  "sports",
  "numbers",
  "health",
  "animals",
  "places",
  "religion",
  "time",
  "emotions",
  "environment",
  "economy",
  "professions",
  "body",
  "plants",
  "art",
];

export const VOCABULARY_TYPES = [
  {
    value: "noun",
    label: "Nouns",
  },
  {
    value: "verb",
    label: "Verbs",
  },
  {
    value: "adjective",
    label: "Adjectives",
  },
  {
    value: "adverb",
    label: "Adverbs",
  },
  {
    value: "preposition",
    label: "Prepositions",
  },
  {
    value: "pronoun",
    label: "Pronouns",
  },
];
