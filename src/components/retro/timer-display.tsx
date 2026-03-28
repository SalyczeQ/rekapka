"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  retroId: string;
  durationSeconds: number | null;
  isFacilitator: boolean;
}

// Local-only timer. Multi-client sync will be added when a WebSocket/SSE layer is introduced.
export function TimerDisplay({
  retroId,
  durationSeconds,
  isFacilitator,
}: TimerDisplayProps) {
  const [remaining, setRemaining] = useState(durationSeconds ?? 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const r = remaining || durationSeconds || 300;
      setRemaining(r);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    const r = durationSeconds || 300;
    setIsRunning(false);
    setRemaining(r);
  };

  if (!durationSeconds && !isFacilitator) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining > 0 && remaining <= 30;

  return (
    <div
      className={cn(
        "fixed top-[100px] right-3 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-background/95 backdrop-blur shadow-sm text-sm font-mono",
        isLow && "animate-pulse border-destructive text-destructive",
        remaining === 0 && !isRunning && "border-destructive text-destructive"
      )}
    >
      <Timer className="h-3.5 w-3.5" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {isFacilitator && (
        <div className="flex gap-0.5 ml-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={toggleTimer}
          >
            {isRunning ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={resetTimer}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
