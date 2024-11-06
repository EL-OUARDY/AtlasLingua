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
import { useUser } from "@/contexts/UserContext";
import { TextGenerateEffect } from "../ui/text-generate-effect";

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
                        <svg
                          id="Layer_1"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1000 1000"
                          className="size-5"
                        >
                          <defs></defs>
                          <g>
                            <path
                              id="Stroke-215"
                              className="cls-1"
                              fill="none"
                              stroke="#f97316"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={"40px"}
                              d="m590.65,926.3c138.17,0,250.19-106.9,250.19-238.76v-79.59"
                            />
                            <polyline
                              id="Stroke-217"
                              className="cls-1"
                              fill="none"
                              stroke="#f97316"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={"40px"}
                              points="757.44 687.54 840.84 607.96 924.24 687.54"
                            />
                          </g>
                          <g>
                            <path
                              id="Stroke-213"
                              className="cls-1"
                              fill="none"
                              stroke="#f97316"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={"40px"}
                              d="m427.57,82.25c-131.61,0-238.32,111.85-238.32,249.81v83.27"
                            />
                            <polyline
                              id="Stroke-219"
                              className="cls-1"
                              fill="none"
                              stroke="#f97316"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={"40px"}
                              points="109.81 332.05 189.25 415.32 268.69 332.05"
                            />
                          </g>
                          <path
                            className="cls-2"
                            fill="#f97316"
                            d="m817.5,62.78c-31.97-19.62-72.84-31.3-112.81-27.2-61.4,6.31-102.64,73.24-119.28,115.5-15.95,40.54,30.61,90.13,77.84,98.91,37.55,6.97,81.4,1.23,118.4-6.07,18.35-25.97,36.69-51.94,55.04-77.91-52.93,12.05-105.86,31.75-149.02,59.61-34.02,21.96-57.11,54.52-77.39,85.14-24.18,36.51-37.66,69.93-20.3,110.43,46.55,108.55,198.81,89.09,291.44,36.22,16.35-9.33,28.08-32.6,37.19-46.35,1.91-2.89,17.91-32.57,13.35-29.97-65.97,37.65-163.64,62.85-234.7,21.1-27.5-16.17-45.22-42.56-56.15-68.06-3.1-8.06-4.76-16.34-4.99-24.83-1.57-21.35,18.1-30.18-19.29,8.6,11.13-11.55,26.78-20.45,41.46-28.68,36.79-20.65,80.43-35.53,123.37-45.3,13.2-3,26.26-28.17,32.29-36.71,2.15-3.05,21.89-41.04,22.75-41.21-23.28,4.59-47.19,7.07-71.07,8.22-45.49,2.17-76.39-5.9-104.56-35.52-6.37-6.69-11.11-14.15-15.69-21.7-2.66-4.84-4.7-9.85-6.11-15.03.53-28.13-9.88-18.97-31.24,27.47,20.43-16.04,50.2-18.55,76.83-16,27.3,2.62,55.72,13.82,77.61,27.25,3.22,1.97,64.97-71.82,55.03-77.92h0Z"
                          />
                          <path
                            className="cls-2"
                            fill="#f97316"
                            d="m154.75,839.69c-2.93,7.3-11.92,23.42-26.99,48.35-15.07,24.94-25.53,38.84-31.38,41.7-5.85,2.87-11.02,4.3-15.49,4.3-6.2,0-13.65-3.43-22.34-10.3-8.69-6.86-13.04-13.95-13.04-21.24,0-6.78,21.6-43.35,64.82-109.73,23.59-36.32,45.11-72.29,64.56-107.91,39.08-71.94,62.97-113.77,71.66-125.5,8.69-11.73,17.6-17.59,26.73-17.59,14.63,0,25.22,3.82,31.76,11.47,3.27,2.44,4.91,8.26,4.91,17.46,0,6.78-.61,12.25-1.81,16.42,31.51,96.96,56.17,165.56,73.99,205.78,17.82,40.23,35.68,69.38,53.59,87.45,8.95,9.04,14.42,15.12,16.4,18.25,1.98,3.13,2.97,7.3,2.97,12.51,0,9.56-3.45,17.59-10.33,24.11-6.89,6.52-15.07,9.77-24.53,9.77-13.09,0-26.39-7.65-39.9-22.94-13.52-15.29-26.26-36.32-38.22-63.08-11.97-26.76-17.95-41.79-17.95-45.09,0-.69-.43-1.04-1.29-1.04-9.3,0-30,3.3-62.11,9.9-32.11,6.61-57.89,13.03-77.34,19.29-5,1.56-9.39,2.35-13.17,2.35-6.71,0-11.88-1.56-15.49-4.69Zm148.75-79.76c-4.13-10.25-16.36-46.74-36.67-109.47-1.9-5.73-3.19-9.38-3.87-10.95l-73.34,140.75c10.85-1.91,21.95-3.65,33.31-5.21,7.57-.87,26.86-4.52,57.85-10.95,7.57-1.56,15.15-2.95,22.72-4.17Z"
                          />
                        </svg>
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
                    {translation.length > 1 ||
                    translation[0].wordType ||
                    translation[0].wordType === "" ? (
                      translation[0].translation
                    ) : (
                      <TextGenerateEffect
                        duration={2}
                        filter={false}
                        words={translation[0].translation}
                      />
                    )}
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
          translation={translationService.stringify(translation)}
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
