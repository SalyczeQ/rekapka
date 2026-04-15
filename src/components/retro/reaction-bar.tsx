"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { REACTION_EMOJIS } from "@/lib/reactions";
import { toggleReaction } from "@/lib/actions/reactions";
import { vibrate } from "@/lib/haptics";
import { playReactionSound } from "@/lib/reaction-sounds";

interface ReactionBarProps {
  cardId: string;
  reactions: Record<string, number>;
  userReactions: string[];
  disabled?: boolean;
  soundEnabled?: boolean;
}

export function ReactionBar({ cardId, reactions, userReactions, disabled, soundEnabled }: ReactionBarProps) {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [localUserReactions, setLocalUserReactions] = useState(userReactions);
  const [isPending, startTransition] = useTransition();
  const [animating, setAnimating] = useState<Record<string, boolean>>({});
  const prevReactionsRef = useRef(reactions);

  // Sync reaction COUNTS from parent (SSE updates from other users).
  // Reference comparison works here — parent creates new objects on SSE events.
  if (reactions !== localReactions && !isPending) {
    setLocalReactions(reactions);
  }
  // userReactions: NO sync — parent never updates this prop (useState with no setter).
  // Local state is the source of truth, managed via optimistic updates + rollback.

  // Detect count increases from SSE (other users reacting) and trigger animation
  useEffect(() => {
    const prev = prevReactionsRef.current;
    prevReactionsRef.current = reactions;

    const changed: Record<string, boolean> = {};
    for (const { key } of REACTION_EMOJIS) {
      const prevCount = prev[key] ?? 0;
      const newCount = reactions[key] ?? 0;
      if (newCount > prevCount) {
        changed[key] = true;
      }
    }
    if (Object.keys(changed).length > 0) {
      setAnimating((a) => ({ ...a, ...changed }));
      // Play sound for incoming reactions from others
      if (soundEnabled) {
        const firstChanged = Object.keys(changed)[0];
        playReactionSound(firstChanged);
      }
      const timeout = setTimeout(() => {
        setAnimating((a) => {
          const next = { ...a };
          for (const key of Object.keys(changed)) delete next[key];
          return next;
        });
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [reactions, soundEnabled]);

  const handleToggle = useCallback(
    (emoji: string) => {
      if (disabled) return;
      vibrate(15);

      const isActive = localUserReactions.includes(emoji);

      // Trigger animation and sound only on add
      if (!isActive) {
        setAnimating({ [emoji]: true });
        if (soundEnabled) playReactionSound(emoji);
        setTimeout(() => {
          setAnimating({});
        }, 600);
      }

      // Optimistic update — use functional updates reading from prev state
      // to avoid stale closure values when SSE syncs trigger re-renders
      setLocalReactions((prev) => ({
        ...prev,
        [emoji]: isActive
          ? Math.max(0, (prev[emoji] ?? 0) - 1)
          : (prev[emoji] ?? 0) + 1,
      }));
      setLocalUserReactions((prev) =>
        isActive ? prev.filter((e) => e !== emoji) : [...prev, emoji]
      );

      startTransition(async () => {
        try {
          await toggleReaction(cardId, emoji);
        } catch {
          // Rollback — reverse the optimistic change
          setLocalReactions((prev) => ({
            ...prev,
            [emoji]: isActive
              ? (prev[emoji] ?? 0) + 1
              : Math.max(0, (prev[emoji] ?? 0) - 1),
          }));
          setLocalUserReactions((prev) =>
            isActive ? [...prev, emoji] : prev.filter((e) => e !== emoji)
          );
        }
      });
    },
    [cardId, localUserReactions, disabled, soundEnabled]
  );

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {REACTION_EMOJIS.map(({ key, display }) => {
        const count = localReactions[key] ?? 0;
        const isActive = localUserReactions.includes(key);
        const isBouncing = animating[key];

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => handleToggle(key)}
            className={cn(
              "flex items-center gap-0.5 px-2 py-1 rounded-full text-sm border touch-action-manipulation select-none",
              "transition-colors duration-200",
              isActive
                ? "bg-primary/15 border-primary/40 shadow-sm"
                : "bg-muted/50 border-transparent hover:bg-muted",
              isBouncing && "animate-reaction-pop",
              disabled && "opacity-60 cursor-default"
            )}
          >
            <span
              className={cn(
                "inline-block transition-transform",
                isBouncing ? "duration-300" : "duration-200"
              )}
              style={isBouncing ? { transform: "scale(1.5)" } : undefined}
            >
              {display}
            </span>
            {count > 0 && (
              <span
                className={cn(
                  "text-xs tabular-nums min-w-[1ch] text-center transition-all",
                  isBouncing ? "font-bold text-primary duration-300 scale-125" : "duration-200"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
