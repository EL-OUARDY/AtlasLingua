import { Language } from "@/models/Translator";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { ArrowRightLeftIcon, History, Share2, Star } from "lucide-react";
import { Button } from "../ui/button";
import Morocco from "../ui/icons/Morocco";
import USA from "../ui/icons/USA";

function TranslateText() {
  const [sourceLang, setSourceLang] = useState<Language>("english");
  const [destinationLang, setDestinationLang] = useState<Language>("darija");

  return (
    <div className="flex h-full flex-col rounded-lg border bg-background dark:bg-transparent">
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {sourceLang === "english" ? (
              <USA className="size-5" />
            ) : (
              <Morocco className="size-5" />
            )}
            <h3 className="font-semibold capitalize tracking-tighter sm:text-lg">
              {sourceLang}
            </h3>
          </div>
        </div>
        <Button
          variant={"ghost"}
          onClick={() => {
            setSourceLang(sourceLang === "english" ? "darija" : "english");
            setDestinationLang(
              destinationLang === "english" ? "darija" : "english",
            );
          }}
        >
          <ArrowRightLeftIcon
            className={`${sourceLang === "english" ? "rotate-180" : ""} transform text-muted-foreground transition-transform duration-300 ease-in-out`}
          />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-end gap-1">
            <h3 className="font-semibold capitalize tracking-tighter sm:text-lg">
              {destinationLang}
            </h3>
            {destinationLang === "english" ? (
              <USA className="size-5" />
            ) : (
              <Morocco className="size-5" />
            )}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col flex-wrap md:flex-row">
        <div className="flex-1 p-4">Source</div>
        <Separator orientation="horizontal" className="md:hidden" />
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="flex-1 p-4">Destination</div>
      </div>
      <Separator />
      <div className="flex items-center justify-center p-4">
        <div className="flex gap-8">
          <div className="hidden cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground md:flex">
            <div className="flex h-fit transform flex-col items-center justify-center rounded-full border p-4 transition-transform duration-300 hover:scale-105">
              <Star className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3>Saved</h3>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-fit transform flex-col items-center justify-center rounded-full border p-4 transition-transform duration-300 hover:scale-105">
              <History className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3>History</h3>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-fit transform flex-col items-center justify-center rounded-full border p-4 transition-transform duration-300 hover:scale-105">
              <Share2 className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3>Share</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslateText;
