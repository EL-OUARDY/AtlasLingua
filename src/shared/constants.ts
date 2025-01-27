import { ROUTES } from "@/routes/routes";

export const APP_NAME = "AtlasLingua";
export const APP_INFO =
  "Our app offers AI-powered translations, a rich vocabulary dictionary from English to Darija, and plenty of helpful learning materials";

export const APP_EMAIL = "ouadia@elouardy.com";
export const APP_GITHUB = "https://github.com/EL-OUARDY";
export const APP_TWITTER = "https://x.com/_ELOUARDY";

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
    href: ROUTES.contribution,
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
    title: "AI-Powered Translation",
    href: ROUTES.translate.index,
    description:
      "Continually learns and adapts, delivering nuanced translations.",
  },
  {
    title: "Community",
    href: ROUTES.community,
    description:
      "Join a vibrant ecosystem of language enthusiasts and native speakers.",
  },
  {
    title: "Dictionary",
    href: ROUTES.dictionary,
    description:
      "Discover the richness of Darija with our user-friendly dictionary!",
  },
  {
    title: "Summarization",
    href: ROUTES.translate.summarization,
    description:
      "Transform lengthy texts, audio and video into concise, actionable insights.",
  },
  {
    title: "Learn",
    href: ROUTES.learn,
    description:
      "Access a vast, well-organized collection of Darija vocabulary.",
  },
  {
    title: "Live Assistance",
    href: "#",
    description:
      "Translations or cultural queries with personalized, on-demand assistance.",
  },
];
