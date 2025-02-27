import { Language, Tips } from "@/models/Translator";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import {
  ArrowRightLeftIcon,
  Check,
  Copy,
  CornerDownLeft,
  History,
  Loader2,
  MessageSquareTextIcon,
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
import { IHistory } from "@/services/historyService";
import { cleanText, getRandomElement, isRTL } from "@/lib/utils";
import { APP_NAME } from "@/shared/constants";
import favoriteService, { IFavorite } from "@/services/favoriteService";
import ReportDialog from "../ReportDialog";
import { useUser } from "@/contexts/UserContext";
import VoiceInput from "../VoiceInput";
import SpeakText from "../SpeakText";
import TransliterationIcon from "../ui/icons/TransliterationIcon";
import { useShareLink } from "@/contexts/ShareLinkContext";

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
  const [favoriteId, setFavoriteId] = useState<number | undefined>();

  const [shareableLink, setShareableLink] = useState<string>("");
  const { openShareDialog } = useShareLink();

  const { setIsHistoryOpen, addToHistory } = useHistory();

  const [prevTranslation, setPrevTranslation] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  const tip = useMemo(() => getRandomElement(Tips), []);

  const { shareableLinkParam } = useParams();

  const { user } = useUser();

  const [isTransliterating, setIsTransliterating] = useState<boolean>(false);

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
      const history: IHistory = location.state.history;

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

        if (user)
          addToHistory(
            data.id,
            sourceLang === "english"
              ? textToTranslate
              : translationService.stringify(translation),
            sourceLang === "darija"
              ? textToTranslate
              : translationService.stringify(translation),
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

  function showTranslation(translation: IHistory) {
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
        wordType: "",
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

  function transliterate() {
    if (isTransliterating) return;
    setIsTransliterating(true);

    // call transliterate API service
    const { request } = translationService.transliterate(textToTranslate);
    request
      .then(({ data }) => {
        setTextToTranslate(data);
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

            <div className="w-full">
              <Separator className="dark:bg-secondary-foreground/10" />
              <div className="flex items-center p-2">
                <VoiceInput
                  language={sourceLang}
                  text={textToTranslate}
                  handleTranscriptChange={setTextToTranslate}
                  shouldStopListening={isTranslating}
                />

                {isRTL(textToTranslate) && sourceLang === "darija" && (
                  <WTooltip
                    side="top"
                    content="Convert to<br />English Letters"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-background/60 dark:hover:bg-background/30"
                      onClick={() => transliterate()}
                    >
                      {isTransliterating ? (
                        <Loader2 className="size-5 animate-spin text-orange-500" />
                      ) : (
                        <TransliterationIcon className="size-5 text-[#f97316]" />
                      )}

                      <span className="sr-only">
                        Convert to English Letters
                      </span>
                    </Button>
                  </WTooltip>
                )}

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
                {translation[0].translation && (
                  <span dir={isRTL(translation[0].translation) ? "rtl" : "ltr"}>
                    {translation[0].translation}
                  </span>
                )}
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
                  {destinationLang === "english" && (
                    <SpeakText text={translation[0].translation} />
                  )}

                  {favoriteId ? (
                    <Button
                      onClick={removeFavorite}
                      variant="ghost"
                      size="icon"
                      className="ml-auto hover:bg-background/60 dark:hover:bg-background/30"
                    >
                      <Star className="size-5 fill-orange-600 stroke-orange-500 text-muted-foreground" />
                    </Button>
                  ) : (
                    <Button
                      onClick={addFavorite}
                      variant="ghost"
                      size="icon"
                      className="ml-auto hover:bg-background/60 dark:hover:bg-background/30"
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

                  {/* Share Button */}
                  <Button
                    onClick={() => openShareDialog(shareableLink)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/60 dark:hover:bg-background/30"
                  >
                    <Share2Icon className="size-5 text-muted-foreground" />
                    <span className="sr-only">Share</span>
                  </Button>

                  {/* Report Translation Button */}
                  <ReportDialog
                    translation={translationService.stringify(translation)}
                    translationId={translationID}
                  />
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
    </div>
  );
}

export default TranslateText;
