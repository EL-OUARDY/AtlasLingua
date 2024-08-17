import { ROUTES } from "@/routes/routes";

export const APP_NAME = "AtlasLingua";
export const APP_INFO =
  "Our app offers a comprehensive dictionary, AI-powered translations, and audio/video summaries to make learning effortless.";
export const GET_STARTED: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Quick Start Guide",
    href: "#",
    description:
      "Discover how to navigate the app and utilize all of its powerful translation features.",
  },
  {
    title: "Our Vision",
    href: "#",
    description:
      "Create a powerful platform that facilitates accurate and intuitive translation.",
  },
  {
    title: "Contributions",
    href: "#",
    description:
      "We aim to compile a comprehensive dataset and develop sophisticated NLP models.",
  },
];

export const FEATURES: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Dictionary",
    href: ROUTES.dictionary,
    description:
      "Unlock the richness of Darija with our comprehensive dictionary.",
  },
  {
    title: "Summarization",
    href: ROUTES.translate.summarization,
    description:
      "Transform lengthy texts, audio and video into concise, actionable insights.",
  },
  {
    title: "Community",
    href: ROUTES.community,
    description:
      "Join a vibrant ecosystem of language enthusiasts and native speakers.",
  },
  {
    title: "Learn",
    href: ROUTES.learn,
    description:
      "Access a vast, meticulously organized collection of Darija vocabulary.",
  },
  {
    title: "Live Assistance",
    href: "#",
    description:
      "Translations or cultural queries with personalized, on-demand assistance.",
  },
  {
    title: "AI-Powered Translation",
    href: ROUTES.translate.index,
    description:
      "Continually learns and adapts, delivering nuanced translations of both languages.",
  },
];
