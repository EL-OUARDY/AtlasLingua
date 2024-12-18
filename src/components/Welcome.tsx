import { APP_NAME } from "@/shared/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/utils";

function Welcome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = getCookie("isWelcomeMessageShown");
    if (!hasSeenWelcome) {
      setOpen(true);
      setCookie("isWelcomeMessageShown", "true", 2); // expires after 2 day
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-11/12 rounded-lg sm:w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hey There!</DialogTitle>
          <DialogDescription className="text-justify">
            You're viewing a beta version that doesn't reflect the final
            product. The website is currently under development, Some features
            may not be fully functional. We invite you to explore and provide
            feedback as we continue to improve. Your input is valuable in
            shaping the final version of our app. Thank you for your
            understanding and participation in this early stage.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogFooter>
          <div className="w-full text-center text-sm tracking-tighter text-muted-foreground sm:text-left">
            @{APP_NAME}
            <span className="text-xs text-muted-foreground/60"> — Beta</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Welcome;
