export interface IDictionary {
  id: number;
  english: string;
  darija: string;
  arabic: string;
  type: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "pronoun ";
  verified: boolean;
  favorite: boolean;
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
