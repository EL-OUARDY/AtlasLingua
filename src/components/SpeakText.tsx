import { Button } from "./ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { CircleStop } from "lucide-react";

interface Props {
  text: string;
}
function SpeakText({ text }: Props) {
  const { speakText, stopSpeaking, speaking } = useSpeechRecognition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-background/60 dark:hover:bg-background/30"
      onClick={() => {
        if (speaking) {
          stopSpeaking();
        } else speakText(text);
      }}
    >
      {speaking ? (
        <CircleStop className="size-5 text-red-500" />
      ) : (
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
      )}
      <span className="sr-only">Speak</span>
    </Button>
  );
}

export default SpeakText;
