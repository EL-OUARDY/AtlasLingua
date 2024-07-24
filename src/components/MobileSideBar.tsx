import { PanelLeft, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NavLink, Link } from "react-router-dom";
import { MenuLinks } from "@/shared/menu-links";
import { ScrollArea } from "./ui/scroll-area";
import React from "react";
import { APP_NAME } from "@/shared/constants";

function MobileSideBar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse application menu
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-screen">
          <nav className="grid gap-6 p-6 text-lg font-medium">
            <Link
              to="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Hash className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">{APP_NAME}</span>
            </Link>

            {MenuLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <link.icon className="h-5 w-5" />
                {link.text}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSideBar;
