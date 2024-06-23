import { ROUTES } from "@/routes/routes";
import {
  BadgeInfo,
  BookOpenText,
  GraduationCap,
  Handshake,
  Heart,
  Languages,
  LucideIcon,
  MessageSquareText,
  MessagesSquare,
  MonitorPlay,
  ShieldCheck,
} from "lucide-react";

interface ISideBarLink {
  text: string;
  href: string;
  icon: LucideIcon;
}

export const MenuLinks: ISideBarLink[] = [
  { text: "Translator", href: ROUTES.translate, icon: Languages },
  { text: "Dictionary", href: ROUTES.dictionary, icon: BookOpenText },
  {
    text: "Media",
    href: ROUTES.media,
    icon: MonitorPlay,
  },
  { text: "Favorites", href: ROUTES.favorites, icon: Heart },
  { text: "Academy", href: ROUTES.academy, icon: GraduationCap },
  { text: "Community", href: ROUTES.community, icon: MessagesSquare },
  {
    text: "Live Assistance",
    href: ROUTES.live_assistance,
    icon: ShieldCheck,
  },
  { text: "Contribution", href: ROUTES.contribution, icon: Handshake },
  { text: "Feedback", href: ROUTES.feedback, icon: MessageSquareText },
  { text: "About", href: ROUTES.about, icon: BadgeInfo },
];
