import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";

const features: { title: string; href: string; description: string }[] = [
  {
    title: "Dictionary",
    href: "#",
    description:
      "Unlock the richness of Darija with our comprehensive dictionary.",
  },
  {
    title: "Summarization",
    href: "#",
    description:
      "Transform lengthy audio and video into concise, actionable insights.",
  },
  {
    title: "Community",
    href: "#",
    description:
      "Join a vibrant ecosystem of language enthusiasts and native speakers.",
  },
  {
    title: "Learn",
    href: "#",
    description:
      "Access a vast, meticulously organized collection of Darija vocabularies.",
  },
  {
    title: "Live Assistance",
    href: "#",
    description:
      "Translations or cultural queries with personalized, on-demand assistance.",
  },
  {
    title: "AI-Powered Translation",
    href: "#",
    description:
      "Continually learns and adapts, delivering nuanced translations of both languages.",
  },
];

interface Props {
  className?: string;
}
function MainMenu(props: Props) {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            Getting started
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-4 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-[.65fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Hash className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {APP_NAME}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Our app offers a comprehensive dictionary, AI-powered
                      translations, and audio/video summaries to make learning
                      effortless.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Quick Start Guide">
                Discover how to navigate the app and utilize all of its powerful
                translation features.
              </ListItem>
              <ListItem href="#" title="Our Vision">
                Create a powerful platform that facilitates accurate and
                intuitive translation.
              </ListItem>
              <ListItem href="#" title="Contributions">
                We aim to compile a comprehensive dataset and develop
                sophisticated NLP models.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {features.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to={ROUTES.contact}
            className={`bg-background ${navigationMenuTriggerStyle()}`}
          >
            Contact us
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MainMenu;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
