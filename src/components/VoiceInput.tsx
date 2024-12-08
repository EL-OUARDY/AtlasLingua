import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AudioLinesIcon } from "./ui/icons/AudioLinesIcon";
import { useEffect } from "react";
import { Language } from "@/models/Translator";

interface Props {
  language: Language;
  text: string;
  handleTranscriptChange: (value: string) => void;
  shouldStopListening: boolean;
}

function VoiceInput({
  language,
  text,
  handleTranscriptChange,
  shouldStopListening,
}: Props) {
  const {
    transcript,
    setTranscript,
    listening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: language === "english" ? "en-US" : "ar-MA",
    textToSyncWith: text,
  });

  useEffect(() => {
    handleTranscriptChange(transcript);
  }, [transcript, handleTranscriptChange]);

  useEffect(() => {
    setTranscript(text);
  }, [text, setTranscript]);

  useEffect(() => {
    stopListening();
  }, [shouldStopListening, stopListening]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`${!listening && "hover:bg-background/60 dark:hover:bg-background/30"}`}
        onClick={() => {
          if (listening) {
            stopListening();
          } else startListening();
        }}
      >
        {listening ? (
          <AudioLinesIcon className="size-5 text-red-500" />
        ) : (
          <Mic className="size-5 text-muted-foreground" />
        )}
        <span className="sr-only">Use Microphone</span>
      </Button>

      {listening && (
        <span
          onClick={stopListening}
          className="mr-2 cursor-pointer text-xs text-red-500"
        >
          Listening..
        </span>
      )}
    </>
  );
}

export default VoiceInput;
