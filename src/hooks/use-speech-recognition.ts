"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Web Speech API type declarations (not in default TS lib)
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string }; isFinal: boolean }; length: number };
}
interface SpeechRecognitionErrorEvent {
  error: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const LOCALE_MAP: Record<string, string> = {
  cs: "cs-CZ",
  en: "en-US",
};

interface UseSpeechRecognitionOptions {
  locale: string;
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  toggle: () => void;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useSpeechRecognition({
  locale,
  onTranscript,
  onError,
}: UseSpeechRecognitionOptions): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  onTranscriptRef.current = onTranscript;
  onErrorRef.current = onError;

  // Defer support check to after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsSupported(getSpeechRecognition() !== null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) return;

    // Stop any existing instance
    recognitionRef.current?.stop();

    const recognition = new SpeechRecognitionClass();
    recognition.lang = LOCALE_MAP[locale] || locale;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        const text = last[0].transcript.trim();
        if (text) {
          onTranscriptRef.current(text);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        onErrorRef.current?.(event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [locale]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, isSupported, toggle, start, stop };
}
