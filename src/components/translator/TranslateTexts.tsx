import { Language, Tips } from "@/models/Translator";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import {
  ArrowRightLeftIcon,
  Check,
  Copy,
  CornerDownLeft,
  Flag,
  History,
  Loader2,
  MessageSquareTextIcon,
  Mic,
  Share2Icon,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import MoroccoIcon from "../ui/icons/Morocco";
import USAIcon from "../ui/icons/USA";
import { Textarea } from "../ui/textarea";
import AiIcon from "../ui/icons/Ai";
import { ScrollArea } from "../ui/scroll-area";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import WTooltip from "../ui/custom/WTooltip";
import { useHistory } from "@/contexts/HistoryContext";
import { Skeleton } from "../ui/skeleton";
import translationService, {
  ITranslationFetchDataRequest,
  ITranslationData,
} from "@/services/translationService";
import { CanceledError } from "axios";
import { toast } from "sonner";
import { ITranslationHistoryFetchDataResult } from "@/services/historyService";
import { cleanText, getRandomElement, isRTL } from "@/lib/utils";
import { APP_NAME } from "@/shared/constants";
import favoriteService, { IFavorite } from "@/services/favoriteService";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";
import ReportDialog from "../ReportDialog";

function TranslateText() {
  const [sourceLang, setSourceLang] = useState<Language>("english");
  const [destinationLang, setDestinationLang] = useState<Language>("darija");

  const [textToTranslate, setTextToTranslate] = useState<string>("");
  const [translation, setTranslation] = useState<ITranslationData[]>([
    {} as ITranslationData,
  ]);
  const [translationID, setTranslationID] = useState<number>();

  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [favoriteId, setFavoriteId] = useState<number | undefined>();
  const [shareableLink, setShareableLink] = useState<string>();

  const { setIsHistoryOpen, addToHistory } = useHistory();

  const [prevTranslation, setPrevTranslation] = useState<string>("");

  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const [isReportOpen, setReportOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const tip = useMemo(() => getRandomElement(Tips), []);

  const { shareableLinkParam } = useParams();

  useEffect(() => {
    // show shared translation
    if (shareableLinkParam) {
      const { request } =
        translationService.get_shared_translation(shareableLinkParam);
      request
        .then(({ data }) => {
          showTranslation(data);
        })
        .catch(() => navigate(ROUTES.translate.index));
    }
  }, [shareableLinkParam, navigate]);

  useEffect(() => {
    // show selected history
    if (location.state && location.state.history) {
      const history: ITranslationHistoryFetchDataResult =
        location.state.history;

      showTranslation(history);

      location.state.history = null; // clear the history state
    }
  }, [location]);

  // main translation function
  function translate() {
    // clean the input text provided by the user
    const input = cleanText(textToTranslate);
    // return if text hasn't changed or is empty
    if (!input || input == "" || input == prevTranslation) return;

    setTranslation([{} as ITranslationData]);
    setIsTranslating(true);
    // call translation API service
    const body: ITranslationFetchDataRequest = {
      text: input,
      source: sourceLang,
      destination: destinationLang,
    };
    const { request } = translationService.translate(body);
    request
      .then(({ data }) => {
        const translation = data.translation;
        setTranslationID(data.id);
        setTranslation(translation);
        setPrevTranslation(input);
        setShareableLink(`${window.location.origin}/share/${data.link}`);
        addToHistory(
          data.id,
          sourceLang === "english"
            ? textToTranslate
            : translation.map((x) => x.translation).join(" | "),
          sourceLang === "darija"
            ? textToTranslate
            : translation.map((x) => x.translation).join(" | "),
          sourceLang,
          data.link,
        );
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
        setIsTranslating(false);
        setFavoriteId(undefined);
      });
  }

  function switchTranslation() {
    setSourceLang(sourceLang === "english" ? "darija" : "english");
    setDestinationLang(destinationLang === "english" ? "darija" : "english");
    setTextToTranslate("");
    setTranslation([{} as ITranslationData]);
    setPrevTranslation("");
  }

  function copyToClipboard() {
    if (isCopied || translation[0].translation == "") return;
    navigator.clipboard.writeText(translation[0].translation);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    // check if Control key (or Command key on macOS) is held down and Enter is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      // perform the translation
      translate();
    }
  }

  function showTranslation(translation: ITranslationHistoryFetchDataResult) {
    setTranslationID(translation.id);
    setShareableLink(
      `${window.location.origin}/share/${translation.shareable_link}`,
    );
    setSourceLang(translation.source_language as Language);
    setDestinationLang(
      translation.source_language == "english" ? "darija" : "english",
    );
    setTextToTranslate(
      translation.source_language == "english"
        ? translation.english
        : translation.darija,
    );

    setTranslation([
      {
        translation:
          translation.source_language == "english"
            ? translation.darija
            : translation.english,
      },
    ]);

    setPrevTranslation(
      translation.source_language == "english"
        ? translation.english
        : translation.darija,
    );
  }

  function addFavorite() {
    const favorite: IFavorite = {
      english:
        sourceLang === "english" ? prevTranslation : translation[0].translation,
      darija:
        sourceLang === "darija" ? prevTranslation : translation[0].translation,
      word_type: translation[0].wordType || undefined,
      verified: translation[0].verified || undefined,
    };
    const { request } = favoriteService.addFavorite(favorite);

    request
      .then(({ data: id }) => {
        setFavoriteId(id);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        // user not logged in
        if (err.response && err.response.status === 401) {
          loginFirst();
          return;
        }

        // if unable to add then restore the list
        setFavoriteId(undefined);

        toast("Failed process your request.", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      });
  }

  function removeFavorite() {
    if (!favoriteId) return;
    const old = favoriteId;
    setFavoriteId(undefined);

    const { request } = favoriteService.deleteFavorite(favoriteId);

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // user not logged in
      if (err.response && err.response.status === 401) {
        loginFirst();
        return;
      }

      // if unable to add then restore the list
      setFavoriteId(old);

      toast("Failed process your request.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(APP_NAME + "-return-url", ROUTES.translate.index);
    // navigate to login
    navigate(ROUTES.login);
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
          <div className="relative flex flex-1 flex-col overflow-auto rounded-lg border bg-secondary no-ring focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              value={textToTranslate}
              onChange={(event) => setTextToTranslate(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
              id="translate-source"
              placeholder={`Type your ${sourceLang} text here...`}
              className="h-full flex-1 resize-none border-0 bg-transparent p-4 text-base text-foreground shadow-none no-ring"
              spellCheck={sourceLang == "english" ? "true" : "false"}
              dir={isRTL(textToTranslate) ? "rtl" : "ltr"}
            />

            <div className="sticky bottom-0 left-0 w-full">
              <Separator className="dark:bg-secondary-foreground/10" />
              <div className="flex items-center p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-background/60 dark:hover:bg-background/30"
                  onClick={() => {
                    toast.warning("Feature Coming Soon.", {
                      description: "Stay tuned! ",
                      action: {
                        label: "OK",
                        onClick: () => {},
                      },
                    });
                  }}
                >
                  <Mic className="size-5 text-muted-foreground" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
                {isTranslating && (
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
                )}
                {isTranslating ? (
                  <Button
                    disabled={isTranslating}
                    type="submit"
                    size="sm"
                    className="ml-auto"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Translating
                  </Button>
                ) : (
                  <div className="ml-auto flex gap-2">
                    {translation && prevTranslation && (
                      <Button
                        type="submit"
                        variant={"link"}
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setTextToTranslate("");
                          setTranslation([{} as ITranslationData]);
                          setPrevTranslation("");
                        }}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => translate()}
                    >
                      Translate <CornerDownLeft className="size-4" />
                    </Button>
                  </div>
                )}
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
          <div className="relative flex flex-1 flex-col overflow-auto rounded-lg border bg-secondary no-ring focus-within:ring-1 focus-within:ring-ring">
            <ScrollArea
              thumbColor="dark:bg-secondary-foreground/10"
              id="translate-source"
              className="h-full flex-1 overflow-auto border-0 p-4 text-base text-foreground shadow-none selection:bg-primary selection:text-primary-foreground"
            >
              {isTranslating && (
                <div className="flex w-full flex-col gap-4">
                  <Skeleton className="h-4 w-[100%] bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-[95%] bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-[92%] bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-[98%] bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-[100%] bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-[92%] bg-muted-foreground/20" />
                </div>
              )}
              <div className="flex items-center gap-1">
                <span dir={isRTL(translation[0].translation) ? "rtl" : "ltr"}>
                  {translation[0].translation}
                </span>
                {translation[0].wordType && (
                  <span className="text-sm capitalize text-muted-foreground">
                    {`(${translation[0].wordType})`}
                  </span>
                )}
                {translation[0].verified && (
                  <WTooltip
                    side="top"
                    content="Verified by <br /> the community"
                  >
                    <ShieldCheck className="size-4 text-green-600" />
                  </WTooltip>
                )}

                {!translation[0].translation && !isTranslating && (
                  <div className="text-sm text-muted-foreground">
                    <svg
                      className="inline size-4 text-yellow-600"
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
                        d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
                      />
                    </svg>
                    <span className="text-yellow-600">Tip: </span>
                    <span>{tip}</span>
                  </div>
                )}
              </div>
              {translation.length > 1 && (
                <div className="mt-4 flex flex-col gap-4">
                  <Separator className="dark:bg-secondary-foreground/10" />
                  <div className="flex flex-col gap-2">
                    {translation.slice(1).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 text-sm"
                      >
                        <span>{item.translation}</span>
                        {item.wordType && (
                          <span className="text-sm capitalize text-muted-foreground">
                            {`(${item.wordType})`}
                          </span>
                        )}
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

            {translation[0].translation && (
              <>
                <Separator className="dark:bg-secondary-foreground/10" />
                <div className="flex items-center p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-auto hover:bg-background/60 dark:hover:bg-background/30"
                    onClick={() => {
                      toast.warning("Feature Coming Soon.", {
                        description: "Stay tuned! ",
                        action: {
                          label: "OK",
                          onClick: () => {},
                        },
                      });
                    }}
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

                  {favoriteId ? (
                    <Button
                      onClick={removeFavorite}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-background/60 dark:hover:bg-background/30"
                    >
                      <Star className="size-5 fill-orange-600 stroke-orange-500 text-muted-foreground" />
                    </Button>
                  ) : (
                    <Button
                      onClick={addFavorite}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-background/60 dark:hover:bg-background/30"
                    >
                      <Star className="size-5 text-muted-foreground" />
                    </Button>
                  )}

                  <span className="sr-only">Save</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/60 dark:hover:bg-background/30"
                    onClick={() => copyToClipboard()}
                  >
                    {!isCopied ? (
                      <Copy className="size-5 text-muted-foreground" />
                    ) : (
                      <Check className="size-5 text-muted-foreground" />
                    )}
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    onClick={() => setIsShareOpen(true)}
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
                      onClick={() => {
                        setReportOpen(true);
                      }}
                    >
                      <Flag className="size-5 text-muted-foreground" />
                      <span className="sr-only">Report Translation</span>
                    </Button>
                  </WTooltip>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Separator className="hidden md:flex landscape:hidden lg:landscape:flex" />
      <div
        id="footer-controls"
        className="hidden items-center justify-center p-4 md:flex landscape:hidden lg:landscape:flex"
      >
        <div className="flex gap-8">
          <Link
            to={ROUTES.favorites}
            className="flex w-14 flex-col items-center justify-center gap-2 text-muted-foreground"
          >
            <div className="flex h-fit w-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary">
              <Star className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3 className="text-sm">Saved</h3>
          </Link>
          <Link
            to="#"
            onClick={() => setIsHistoryOpen(true)}
            className="flex w-14 flex-col items-center justify-center gap-2 text-muted-foreground"
          >
            <div className="flex h-fit w-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary">
              <History className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3 className="text-sm">History</h3>
          </Link>
          <Link
            to={ROUTES.feedback}
            className="flex w-14 flex-col items-center justify-center gap-2 text-muted-foreground"
          >
            <div className="flex h-fit w-fit transform flex-col items-center justify-center rounded-full border bg-background p-4 transition-transform duration-300 hover:scale-105 dark:bg-secondary">
              <MessageSquareTextIcon className="size-4 text-muted-foreground md:size-5" />
            </div>
            <h3 className="text-sm">Feedback</h3>
          </Link>
        </div>
      </div>

      {/* report dialog */}
      {isReportOpen && (
        <ReportDialog
          isOpen={isReportOpen}
          translation={translation.map((x) => x.translation).join("\n")}
          translationId={translationID}
          setIsOpen={setReportOpen}
        />
      )}

      {/* share drawer */}
      {isShareOpen && (
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
                    value={shareableLink}
                    readOnly
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareableLink as string);
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
      )}
    </div>
  );
}

export default TranslateText;
