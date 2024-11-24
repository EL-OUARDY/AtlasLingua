import { APP_NAME } from "@/shared/constants";
import { Copy, Check, Share2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { useState } from "react";

interface Props {
  link: string;
}

function ShareTranslation({ link }: Props) {
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => setIsShareOpen(true)}
        variant="ghost"
        size="icon"
        className="hover:bg-background/60 dark:hover:bg-background/30"
      >
        <Share2Icon className="size-5 text-muted-foreground" />
        <span className="sr-only">Share</span>
      </Button>

      <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm py-4">
            <DrawerHeader className="text-left">
              <DrawerTitle className="mb-2">{APP_NAME}</DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                Share this link with your friends.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerFooter className="pt-0">
              <div className="flex gap-2">
                <Input
                  className="text-muted-foreground no-ring"
                  value={link}
                  readOnly
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(link as string);
                    setIsLinkCopied(true);
                    setTimeout(() => setIsLinkCopied(false), 2000);
                  }}
                  variant="secondary"
                  className="shrink-0"
                >
                  {!isLinkCopied ? (
                    <Copy className="size-5 text-muted-foreground" />
                  ) : (
                    <Check className="size-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ShareTranslation;
