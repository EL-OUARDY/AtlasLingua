import { ROUTES } from "@/routes/routes";
import {
  BadgeInfo,
  BookOpenText,
  GraduationCap,
  Handshake,
  Languages,
  LucideIcon,
  MessageSquareText,
  MessagesSquare,
  ShieldCheck,
  SquarePlay,
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
    text: "Media Translation",
    href: ROUTES.media_translation,
    icon: SquarePlay,
  },
  { text: "Learn", href: ROUTES.learn, icon: GraduationCap },
  { text: "Community", href: ROUTES.community, icon: MessagesSquare },
  { text: "Contribution", href: ROUTES.contribution, icon: Handshake },
  {
    text: "Live Assistance",
    href: ROUTES.live_assistance,
    icon: ShieldCheck,
  },
  { text: "Feedback", href: ROUTES.feedback, icon: MessageSquareText },
  { text: "About", href: ROUTES.about, icon: BadgeInfo },
];
