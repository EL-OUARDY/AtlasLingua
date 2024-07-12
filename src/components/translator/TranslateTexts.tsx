import { ITranslate, Language } from "@/models/Translator";
import { useState } from "react";
import { Separator } from "../ui/separator";
import {
  ArrowRightLeftIcon,
  Copy,
  CornerDownLeft,
  Flag,
  History,
  MessageSquareTextIcon,
  Mic,
  Share2Icon,
  ShieldCheck,
  Star,
  Volume2,
  Volume2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import MoroccoIcon from "../ui/icons/Morocco";
import USAIcon from "../ui/icons/USA";
import { Textarea } from "../ui/textarea";
import AiIcon from "../ui/icons/Ai";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import WTooltip from "../ui/custom/WTooltip";
import { useHistory } from "@/contexts/HistoryContext";

function TranslateText() {
  const [sourceLang, setSourceLang] = useState<Language>("english");
  const [destinationLang, setDestinationLang] = useState<Language>("darija");
  const [translation, setTranslation] = useState<ITranslate>({
    source: "Hello",
    destination: "Salam",
    verified: true,
    alternatives: [
      {
        alternative: "Mrahba",
        verified: true,
      },
      {
        alternative: "Ahlan",
        verified: false,
      },
    ],
  });

  const { setIsHistoryOpen } = useHistory();

  // main translation function
  function translate(text: string) {
    console.log("Translating");
    setTranslation({ source: text, destination: "" });

    // call translation API service
    if (translation.source && translation.source !== "") {
      return; // call translation API service
    }
  }

  function switchTranslation() {
    setSourceLang(sourceLang === "english" ? "darija" : "english");
    setDestinationLang(destinationLang === "english" ? "darija" : "english");
    translate(translation.destination);
  }

  return (
    <div className="flex h-full flex-col overflow-auto rounded-lg border bg-background dark:bg-transparent">
      <div id="language-switch" className="flex items-center gap-2 px-4 py-2">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {sourceLang === "english" ? (
              <USAIcon className="size-5" />
            ) : (
              <MoroccoIcon className="size-5" />
            )}
            <Separator orientation="vertical" className="mx-1 h-5" />
            <h3 className="font-semibold capitalize tracking-tighter sm:text-lg">
              {sourceLang}
            </h3>
          </div>
        </div>
        <Button variant={"ghost"} onClick={() => switchTranslation()}>
          <ArrowRightLeftIcon
            className={`${sourceLang === "english" ? "rotate-180" : ""} size-5 transform text-muted-foreground transition-transform duration-300 ease-in-out`}
          />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-end gap-1">
            <h3 className="font-semibold capitalize tracking-tighter sm:text-lg">
              {destinationLang}
            </h3>
            <Separator orientation="vertical" className="mx-1 h-5" />
            {destinationLang === "english" ? (
              <USAIcon className="size-5" />
            ) : (
              <MoroccoIcon className="size-5" />
            )}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col flex-wrap overflow-hidden lg:flex-row landscape:sm:flex-row">
        <div
          id="source-panel"
          className="flex h-full flex-1 overflow-auto bg-background p-4 dark:bg-transparent"
        >
          <div className="no-ring relative flex flex-1 flex-col overflow-auto rounded-lg border bg-secondary focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              value={translation.source}
              onChange={(event) => translate(event.target.value)}
              id="translate-source"
              placeholder="Type your text here..."
              className="no-ring h-full flex-1 resize-none border-0 bg-transparent p-4 text-base text-foreground shadow-none"
            />
            <div className="sticky bottom-0 left-0 w-full">
              <Separator className="dark:bg-secondary-foreground/10" />
              <div className="flex items-center p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-background/60 dark:hover:bg-background/30"
                >
                  <Mic className="size-5 text-muted-foreground" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
                <WTooltip side="top" content="AI-Powered">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/60 dark:hover:bg-background/30"
                  >
                    <AiIcon className="size-5" />
                    <span className="sr-only">AI-Powered</span>
                  </Button>
                </WTooltip>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Translate
                  <CornerDownLeft className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator
          orientation="horizontal"
          className="lg:hidden landscape:sm:hidden"
        />
        <Separator
          orientation="vertical"
          className="hidden lg:block landscape:sm:block"
        />
        <div
          id="destination-panel"
          className="flex h-full flex-1 flex-col overflow-auto bg-background p-4 dark:bg-transparent"
        >
          <div className="no-ring relative flex flex-1 flex-col overflow-auto rounded-lg border bg-secondary focus-within:ring-1 focus-within:ring-ring">
            <ScrollArea
              thumbColor="dark:bg-secondary-foreground/10"
              id="translate-source"
              className="h-full flex-1 overflow-auto border-0 p-4 text-base text-foreground shadow-none selection:bg-primary selection:text-primary-foreground"
            >
              <div className="flex items-center gap-1">
                {translation.destination}
                {translation.verified && (
                  <WTooltip
                    side="top"
                    content="Verified by <br /> the community"
                  >
                    <ShieldCheck className="size-4 text-green-600" />
                  </WTooltip>
                )}
              </div>
              {translation.alternatives && (
                <div className="mt-4 flex flex-col gap-4">
                  <Separator className="dark:bg-secondary-foreground/10" />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold tracking-tight text-muted-foreground">
                      Alternatives:
                    </h3>
                    {translation.alternatives.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                      >
                        {item.alternative}
                        {item.verified && (
                          <WTooltip
                            side="top"
                            content="Verified by <br /> the community"
                          >
                            <ShieldCheck className="size-4 text-green-600" />
                          </WTooltip>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>

            <Separator className="dark:bg-secondary-foreground/10" />
            <div className="flex items-center p-2">
              <Button
                variant="ghost"
                size="icon"
                className="mr-auto hover:bg-background/60 dark:hover:bg-background/30"
              >
                <svg
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>

                <span className="sr-only">Speak</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-background/60 dark:hover:bg-background/30"
              >
                <Copy className="size-5 text-muted-foreground" />
                <span className="sr-only">Copy</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-background/60 dark:hover:bg-background/30"
              >
                <Share2Icon className="size-5 text-muted-foreground" />
                <span className="sr-only">Share</span>
              </Button>
              <WTooltip side="top" content="Report Translation">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-background/60 dark:hover:bg-background/30"
                >
                  <Flag className="size-5 text-muted-foreground" />
                  <span className="sr-only">Report Translation</span>
                </Button>
              </WTooltip>
            </div>
          </div>
        </div>
      </div>
      <Separator className="hidden md:flex" />
      <div
        id="footer-controls"
        className="hidden items-center justify-center p-4 md:flex landscape:hidden lg:landscape:flex"
      >
        <div className="flex gap-8">
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              to={ROUTES.favorites}
              className="flex h-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary"
            >
              <Star className="size-4 text-muted-foreground md:size-5" />
            </Link>

            <h3>Saved</h3>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              to="#"
              onClick={() => setIsHistoryOpen(true)}
              className="flex h-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary"
            >
              <History className="size-4 text-muted-foreground md:size-5" />
            </Link>
            <h3>History</h3>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link
              to={ROUTES.feedback}
              className="flex h-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary"
            >
              <MessageSquareTextIcon className="size-4 text-muted-foreground md:size-5" />
            </Link>
            <h3>Feedback</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslateText;
