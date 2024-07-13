export interface IDictionary {
  id: number;
  english: string;
  darija: string;
  arabic: string;
  type: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "pronoun ";
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
    | "nature"
    | "objects"
    | "planets"
    | "professions"
    | "body"
    | "plants"
    | null;
  verified: boolean;
  favorite: boolean;
  popularity?: number;
  date?: string;
}

export const vacabularyTypes = [
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
