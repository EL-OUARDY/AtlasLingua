import { Language } from "@/models/Translator";
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
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import MoroccoIcon from "../ui/icons/Morocco";
import USAIcon from "../ui/icons/USA";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Textarea } from "../ui/textarea";
import AiIcon from "../ui/icons/Ai";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

function TranslateText() {
  const [sourceLang, setSourceLang] = useState<Language>("english");
  const [destinationLang, setDestinationLang] = useState<Language>("darija");

  return (
    <div className="flex h-full flex-col overflow-auto rounded-lg border dark:bg-transparent">
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
      <div className="flex flex-1 flex-col flex-wrap overflow-hidden md:flex-row">
        <div id="source-panel" className="flex flex-1 overflow-auto p-4">
          <div className="no-ring relative flex flex-1 flex-col overflow-auto rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring dark:bg-secondary">
            <Textarea
              id="translate-source"
              placeholder="Type your text here..."
              className="no-ring h-full flex-1 resize-none border-0 bg-transparent p-4 text-base text-foreground shadow-none"
            />
            <div className="sticky bottom-0 left-0 w-full">
              <Separator className="dark:bg-secondary-foreground/10" />
              <div className="flex items-center p-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="dark:hover:bg-background/30"
                        size="icon"
                      >
                        <Mic className="size-5 text-muted-foreground" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="dark:hover:bg-background/30"
                        size="icon"
                      >
                        <AiIcon className="size-5" />
                        <span className="sr-only">AI</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">AI-Powered</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Translate
                  <CornerDownLeft className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" className="md:hidden" />
        <Separator orientation="vertical" className="hidden md:block" />
        <div
          id="destination-panel"
          className="flex h-full flex-1 flex-col overflow-auto p-4"
        >
          <div className="no-ring relative flex flex-1 flex-col overflow-auto rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring dark:bg-secondary">
            <ScrollArea
              thumbColor="dark:bg-secondary-foreground/10"
              id="translate-source"
              className="h-full flex-1 overflow-auto border-0 p-4 text-base text-foreground shadow-none selection:bg-primary selection:text-primary-foreground"
            >
              {/*  */}
            </ScrollArea>

            <Separator className="dark:bg-secondary-foreground/10" />
            <div className="ml-auto">
              <div className="flex items-center p-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="dark:hover:bg-background/30"
                        size="icon"
                      >
                        <Copy className="size-5 text-muted-foreground" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Copy</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="dark:hover:bg-background/30"
                        size="icon"
                      >
                        <Share2Icon className="size-5 text-muted-foreground" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Share</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="dark:hover:bg-background/30"
                        size="icon"
                      >
                        <Flag className="size-5 text-muted-foreground" />
                        <span className="sr-only">Report Translation</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Report Translation
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="hidden md:flex" />
      <div className="hidden items-center justify-center p-4 md:flex">
        <div className="flex gap-8">
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary">
              <Star className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3>Saved</h3>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary">
              <History className="size-4 text-muted-foreground md:size-5" />
            </div>
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
