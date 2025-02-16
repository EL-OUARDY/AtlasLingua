import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy, CornerDownLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cleanText, isRTL } from "@/lib/utils";
import { CanceledError } from "axios";
import { toast } from "sonner";
import translationService, {
  ISummarizationFetchDataRequest,
} from "@/services/translationService";
import { TextGenerateEffect } from "../ui/text-generate-effect";

function Summarization() {
  const [textToSummarize, setTextToSummarize] = useState<string>("");
  const [summarization, setSummarization] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [prevSummarization, setPrevSummarization] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showOutput, setShowOutput] = useState<boolean>(false);

  function summarize() {
    // already summarized
    if (textToSummarize && textToSummarize == prevSummarization) {
      setShowOutput(true);
      return;
    }
    // clean the input text provided by the user
    const input = cleanText(textToSummarize);
    // return if text hasn't changed or is empty
    if (!input || input == "" || input == prevSummarization) return;

    setSummarization("");
    setIsSummarizing(true);
    // call translation API service
    const body: ISummarizationFetchDataRequest = {
      text: input,
    };
    const { request } = translationService.summarize(body);
    request
      .then(({ data }) => {
        setSummarization(data);
        setPrevSummarization(input);
        setShowOutput(true);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        const msg =
          err.response.data.message ||
          "Can't proccess your request. Please try again!";
        toast(msg, {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      })
      .finally(() => {
        setIsSummarizing(false);
      });
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    // check if Control key (or Command key on macOS) is held down and Enter is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      // perform the translation
      summarize();
    }
  }

  function copyToClipboard() {
    if (isCopied || summarization == "") return;
    navigator.clipboard.writeText(summarization);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="h-full gap-4 overflow-auto rounded-lg lg:w-[600px]">
      <div
        className={`${showOutput && "hidden"} flex h-full flex-col gap-4 rounded-lg bg-background p-4 md:p-6`}
      >
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Summarization
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get quick and accurate summaries/explanations of Darija content in
            English with our smart summarization tool. Save time by skipping
            full text translation. Our advanced technology picks out the most
            important information, giving you short and relevant summaries.
          </p>
        </div>
        <Separator />

        <Textarea
          id="summary"
          value={textToSummarize}
          onChange={(event) => setTextToSummarize(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder={`Please include the Darija text you want to summarize.`}
          className="min-h-[150px] flex-1 bg-secondary px-4 py-2 no-ring"
          spellCheck={"false"}
          dir={isRTL(textToSummarize) ? "rtl" : "ltr"}
          disabled={isSummarizing}
        />

        {isSummarizing ? (
          <Button
            disabled={isSummarizing}
            type="submit"
            size="sm"
            className="ml-auto"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing
          </Button>
        ) : (
          <div className="ml-auto flex gap-2">
            {summarization && prevSummarization && (
              <Button
                type="submit"
                variant={"link"}
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setTextToSummarize("");
                  setSummarization("");
                  setPrevSummarization("");
                }}
              >
                Clear
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="gap-1.5"
              onClick={() => summarize()}
            >
              Summarize <CornerDownLeft className="size-4" />
            </Button>
          </div>
        )}
      </div>
      <div
        className={`${!showOutput && "hidden"} h-full overflow-auto rounded-lg bg-background p-4 md:p-6`}
      >
        <div className="flex h-full flex-col gap-4">
          <ScrollArea
            className="flex-1 rounded-lg bg-secondary p-4"
            thumbColor="dark:bg-secondary-foreground/10"
          >
            {summarization && (
              <TextGenerateEffect duration={2} words={summarization} />
            )}
          </ScrollArea>
          <div className="flex justify-between rounded-lg bg-secondary p-2">
            <Button
              type="submit"
              variant={"link"}
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setShowOutput(false);
              }}
            >
              Go back
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="dark:hover:bg-background/30"
              onClick={() => copyToClipboard()}
            >
              {!isCopied ? (
                <Copy className="size-5 text-muted-foreground" />
              ) : (
                <Check className="size-5 text-muted-foreground" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarization;
