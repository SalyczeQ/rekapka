"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Square, Loader2 } from "lucide-react";

interface ReadAloudButtonProps {
  text: string;
  size?: "sm" | "icon";
  variant?: "ghost" | "outline" | "secondary";
  className?: string;
}

export function ReadAloudButton({
  text,
  size = "icon",
  variant = "ghost",
  className,
}: ReadAloudButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setState("idle");
  }, []);

  const play = useCallback(async () => {
    if (state === "playing") {
      stop();
      return;
    }

    if (!text.trim()) return;

    setState("loading");

    try {
      const res = await fetch("/api/ai/read-aloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        stop();
      };

      audio.onerror = () => {
        stop();
      };

      await audio.play();
      setState("playing");
    } catch {
      setState("idle");
    }
  }, [text, state, stop]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={play}
      className={className}
      aria-label={state === "playing" ? "Stop reading" : "Read aloud"}
    >
      {state === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : state === "playing" ? (
        <Square className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </Button>
  );
}
