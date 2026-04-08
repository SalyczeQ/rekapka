"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DictationButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  enabled?: boolean;
}

export function DictationButton({ onTranscript, className, enabled = true }: DictationButtonProps) {
  const locale = useLocale();
  const t = useTranslations("card");

  const { isListening, isSupported, toggle } = useSpeechRecognition({
    locale,
    onTranscript: (text) => {
      if (navigator.vibrate) navigator.vibrate(30);
      onTranscript(text);
    },
    onError: () => {
      toast.error(t("dictationNotSupported"));
    },
  });

  if (!isSupported || !enabled) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 shrink-0 relative",
        isListening && "text-destructive",
        className
      )}
      onClick={() => {
        if (navigator.vibrate) navigator.vibrate(20);
        toggle();
      }}
      aria-label={isListening ? t("stopDictation") : t("startDictation")}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" aria-hidden="true" />
          <span className="absolute inset-0 rounded-md ring-2 ring-destructive/50 animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
