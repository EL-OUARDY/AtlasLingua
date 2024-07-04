import { ROUTES } from "@/routes/routes";
import {
  BookOpenText,
  Library,
  Handshake,
  Star,
  Languages,
  LucideIcon,
  MessageSquareText,
  MessagesSquare,
  BadgeInfo,
  Mail,
} from "lucide-react";

interface ISideBarLink {
  text: string;
  href: string;
  icon: LucideIcon;
  onlyMobile: boolean;
}

export const MenuLinks: ISideBarLink[] = [
  {
    text: "Translator",
    href: ROUTES.translate.index,
    icon: Languages,
    onlyMobile: false,
  },
  {
    text: "Dictionary",
    href: ROUTES.dictionary,
    icon: BookOpenText,
    onlyMobile: false,
  },
  { text: "Favorites", href: ROUTES.favorites, icon: Star, onlyMobile: false },
  { text: "Learn", href: ROUTES.learn, icon: Library, onlyMobile: false },
  {
    text: "Community",
    href: ROUTES.community,
    icon: MessagesSquare,
    onlyMobile: false,
  },
  // {
  //   text: "Live Assistance",
  //   href: ROUTES.live_assistance,
  //   icon: MessageCircleQuestion,
  //   onlyMobile: false,
  // },
  {
    text: "Contribution",
    href: ROUTES.contribution,
    icon: Handshake,
    onlyMobile: false,
  },
  {
    text: "Feedback",
    href: ROUTES.feedback,
    icon: MessageSquareText,
    onlyMobile: false,
  },
  {
    text: "Get Started",
    href: ROUTES.about,
    icon: BadgeInfo,
    onlyMobile: false,
  },
  {
    text: "Support",
    href: ROUTES.contact,
    icon: Mail,
    onlyMobile: true,
  },
];
