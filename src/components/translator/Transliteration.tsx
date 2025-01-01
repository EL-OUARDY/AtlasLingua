import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy, CornerDownLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cleanText, isRTL } from "@/lib/utils";
import { CanceledError } from "axios";
import { toast } from "sonner";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import translationService from "@/services/translationService";

function Transliteration() {
  const [textToTransliterate, setTextToTransliterate] = useState<string>("");
  const [transliteration, setTransliteration] = useState<string>("");
  const [isTransliterating, setIsTransliterating] = useState<boolean>(false);
  const [prevTransliteration, setPrevTransliteration] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showOutput, setShowOutput] = useState<boolean>(false);

  function transliterate() {
    // already processed
    if (textToTransliterate && textToTransliterate == prevTransliteration) {
      setShowOutput(true);
      return;
    }
    // clean the input text provided by the user
    const input = cleanText(textToTransliterate);
    // return if text hasn't changed or is empty
    if (!input || input == "" || input == prevTransliteration) return;

    setTransliteration("");
    setIsTransliterating(true);

    // call transliterate API service
    const { request } = translationService.transliterate(input);
    request
      .then(({ data }) => {
        setTransliteration(data);
        setPrevTransliteration(input);
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
        setIsTransliterating(false);
      });
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    // check if Control key (or Command key on macOS) is held down and Enter is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      // perform the translation
      transliterate();
    }
  }

  function copyToClipboard() {
    if (isCopied || transliteration == "") return;
    navigator.clipboard.writeText(transliteration);
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
            Transliteration
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Convert your Darija text (in Arabic script) into Latin characters
            for easy reading and typing. Just paste or type your text below,
            then click Transliterate.
          </p>
        </div>
        <Separator />

        <Textarea
          id="transliteration"
          value={textToTransliterate}
          onChange={(event) => setTextToTransliterate(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder={`Please include the Darija text (in Arabic letters)`}
          className={`min-h-[150px] flex-1 bg-secondary px-4 py-2 no-ring ${!isRTL(textToTransliterate) && textToTransliterate !== "" && "border-red-500"}`}
          spellCheck={"false"}
          dir={isRTL(textToTransliterate) ? "rtl" : "ltr"}
          disabled={isTransliterating}
        />

        {isTransliterating ? (
          <Button
            disabled={isTransliterating}
            type="submit"
            size="sm"
            className="ml-auto"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {!isRTL(textToTransliterate) && textToTransliterate !== "" && (
              <div className="text-xs text-red-600 underline">
                Please enter text in Arabic letters.
              </div>
            )}

            <div className="ml-auto flex gap-2">
              {transliteration &&
                prevTransliteration &&
                isRTL(textToTransliterate) && (
                  <Button
                    type="submit"
                    variant={"link"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setTextToTransliterate("");
                      setTransliteration("");
                      setPrevTransliteration("");
                    }}
                  >
                    Clear
                  </Button>
                )}
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
                onClick={() => transliterate()}
                disabled={
                  !isRTL(textToTransliterate) && textToTransliterate !== ""
                }
              >
                Transliterate
                <CornerDownLeft className="size-4" />
              </Button>
            </div>
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
            {transliteration && (
              <TextGenerateEffect duration={2} words={transliteration} />
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

export default Transliteration;
