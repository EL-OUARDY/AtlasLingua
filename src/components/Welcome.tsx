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
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";

interface IWelcomeMessage {
  id?: string;
  title: string;
  body: string;
}

function Welcome() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<IWelcomeMessage>({
    title: "",
    body: "",
  });

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  const getWelcomeMessage = async () => {
    const q = query(collection(db, "welcome_message"), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setOpen(false);
      return;
    }

    const firstDoc = querySnapshot.docs[0];
    setMessage({
      id: firstDoc.id,
      ...(firstDoc.data() as Omit<IWelcomeMessage, "id">),
    });

    const hasSeenWelcome = getCookie(`isWelcomeMessageShown-${firstDoc.id}`);
    if (!hasSeenWelcome) {
      setOpen(true);
      setCookie(`isWelcomeMessageShown-${firstDoc.id}`, "true", 7); // expires after 7 day
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-11/12 rounded-lg sm:w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{message.title}</DialogTitle>
          <DialogDescription className="text-justify">
            {message.body}
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
