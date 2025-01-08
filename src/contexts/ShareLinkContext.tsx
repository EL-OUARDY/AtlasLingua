import { APP_NAME } from "@/shared/constants";
import { Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { Input } from "../components/ui/input";
import { createContext, ReactNode, useContext, useState } from "react";

interface IShareLinkContext {
  openShareDialog: (link: string) => void;
}

const ShareLinkContext = createContext<IShareLinkContext>(
  {} as IShareLinkContext,
);

// custom hook to expose the ShareLinkContext
export function useShareLink() {
  return useContext(ShareLinkContext);
}

interface Props {
  children: ReactNode;
}

function ShareLinkProvider({ children }: Props) {
  const [link, setLink] = useState<string>("");
  const [message, setMessage] = useState<string>(
    "Share this link with your friends.",
  );
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  function openShareDialog(link: string, message: string = "") {
    setLink(link);
    if (message) setMessage(message);
    setIsShareOpen(true);
  }

  return (
    <ShareLinkContext.Provider
      value={{
        openShareDialog,
      }}
    >
      {children}
      <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm py-4">
            <DrawerHeader className="text-left">
              <DrawerTitle className="mb-2">{APP_NAME}</DrawerTitle>
              <DrawerDescription className="text-muted-foreground">
                {message}
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
    </ShareLinkContext.Provider>
  );
}

export default ShareLinkProvider;
