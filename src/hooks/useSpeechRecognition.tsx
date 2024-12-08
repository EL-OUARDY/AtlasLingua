import { useEffect, useRef, useState, useCallback } from "react";

interface UseSpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  textToSyncWith?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  setTranscript: (value: string) => void;
  listening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  speaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn {
  const {
    lang = "en-US",
    interimResults = false,
    continuous = true,
    textToSyncWith = "",
  } = options;

  const [transcript, setTranscript] = useState<string>(textToSyncWith);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [speaking, setSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setError("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;
    recognition.lang = lang;
    recognition.interimResults = interimResults;
    recognition.continuous = continuous;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += result;
        } else {
          finalTranscript += result;
        }
      }

      setTranscript((prevTranscript) => prevTranscript + finalTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [lang, interimResults, continuous]);

  const startListening = useCallback(() => {
    setTranscript("");
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError((err as Error)?.message || "Failed to start recognition.");
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        setError("Speech Synthesis not supported in this browser.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // Optional: adjust pitch, rate, volume
      // utterance.pitch = 1;
      // utterance.rate = 1;
      // utterance.volume = 1;

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };

      utterance.onerror = (e) => {
        setError("Speech synthesis error: " + e.error);
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [lang],
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  return {
    transcript,
    setTranscript,
    listening,
    error,
    startListening,
    stopListening,
    speaking,
    speakText,
    stopSpeaking,
  };
}
