"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { deleteCardAction, toggleDiscussedAction } from "@/lib/actions/retro-session";
import { RetroPhaseBar } from "./retro-phase-bar";
import { PhaseWriting } from "./phase-writing";
import { PhaseDiscussing } from "./phase-discussing";
import { PhaseActions } from "./phase-actions";
import { TimerDisplay } from "./timer-display";
import { ParticipantBar } from "./participant-bar";
import { RetroMetadata } from "./retro-metadata";
import { RetroCompletionModal } from "@/components/shared/retro-completion-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type RetroStatus =
  | "draft"
  | "writing"
  | "grouping"
  | "voting"
  | "discussing"
  | "actions"
  | "completed";

const PHASE_ORDER: RetroStatus[] = [
  "draft",
  "writing",
  "grouping",
  "voting",
  "discussing",
  "actions",
  "completed",
];

interface RetroSessionProps {
  retro: {
    id: string;
    title: string;
    status: string;
    template: string;
    location: string | null;
    photo_url: string | null;
    date: string;
    max_votes: number;
    phase_timer_seconds: number | null;
  };
  categories: {
    id: string;
    name: string;
    icon: string | null;
    sort_order: number;
    color: string | null;
  }[];
  initialCards: {
    id: string;
    category_id: string;
    author_id: string;
    text: string;
    sort_order: number;
    group_label: string | null;
    is_discussed: boolean;
    created_at: string;
  }[];
  initialVotes: {
    id: string;
    card_id: string;
    user_id: string;
  }[];
  currentUserId: string;
  userRole: string;
  teamSlug: string;
}

export function RetroSession({
  retro,
  categories,
  initialCards,
  initialVotes,
  currentUserId,
  userRole,
  teamSlug,
}: RetroSessionProps) {
  const [status, setStatus] = useState<RetroStatus>(
    retro.status as RetroStatus
  );
  const [cards, setCards] = useState(initialCards);
  const [votes, setVotes] = useState(initialVotes);
  const [showCompletion, setShowCompletion] = useState(false);
  const isFacilitator = userRole === "owner" || userRole === "facilitator";
  const statusRef = useRef(status);
  statusRef.current = status;

  // Poll for card and vote updates during active phases
  useEffect(() => {
    if (status === "completed") return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/retros/${retro.id}/cards`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.cards) {
          setCards(data.cards);
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [retro.id, status]);

  // Poll for phase/status changes
  useEffect(() => {
    if (status === "completed") return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/retros/${retro.id}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status && data.status !== statusRef.current) {
          setStatus(data.status as RetroStatus);
          toast.info(`Phase changed to ${data.status}`);
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [retro.id, status]);

  const advancePhase = useCallback(async () => {
    const currentIndex = PHASE_ORDER.indexOf(status);
    if (currentIndex >= PHASE_ORDER.length - 1) return;

    const nextStatus = PHASE_ORDER[currentIndex + 1];

    if (nextStatus === "completed") {
      setShowCompletion(true);
      return;
    }

    const res = await fetch(`/api/retros/${retro.id}/phase`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_status: nextStatus }),
    });

    if (!res.ok) {
      toast.error("Failed to advance phase");
      return;
    }

    setStatus(nextStatus);
  }, [status, retro.id]);

  const handleComplete = useCallback(async () => {
    const res = await fetch(`/api/retros/${retro.id}/complete`, {
      method: "POST",
    });

    if (!res.ok) {
      toast.error("Failed to complete retro");
      return;
    }

    setStatus("completed");
    setShowCompletion(false);
  }, [retro.id]);

  const addCard = useCallback(
    async (categoryId: string, text: string) => {
      const res = await fetch(`/api/retros/${retro.id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: categoryId, text }),
      });
      if (!res.ok) {
        toast.error("Failed to add card");
        return;
      }
      const data = await res.json();
      if (data.card) {
        setCards((prev) => [
          ...prev,
          {
            id: data.card.id,
            category_id: data.card.categoryId,
            author_id: data.card.authorId,
            text: data.card.text,
            sort_order: data.card.sortOrder,
            group_label: data.card.groupLabel,
            is_discussed: data.card.isDiscussed,
            created_at: data.card.createdAt,
          },
        ]);
      }
    },
    [retro.id]
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      const result = await deleteCardAction(cardId, retro.id);
      if (result?.error) {
        toast.error("Failed to delete card");
        return;
      }
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    },
    [retro.id]
  );

  const toggleVote = useCallback(
    async (cardId: string) => {
      const existing = votes.find(
        (v) => v.card_id === cardId && v.user_id === currentUserId
      );
      if (existing) {
        const res = await fetch(`/api/retros/${retro.id}/votes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote_id: existing.id }),
        });
        if (res.ok) {
          setVotes((prev) => prev.filter((v) => v.id !== existing.id));
        }
      } else {
        const userVoteCount = votes.filter(
          (v) => v.user_id === currentUserId
        ).length;
        if (userVoteCount >= retro.max_votes) {
          toast.error(`Maximum ${retro.max_votes} votes reached`);
          return;
        }
        const res = await fetch(`/api/retros/${retro.id}/votes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card_id: cardId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.vote) {
            setVotes((prev) => [
              ...prev,
              {
                id: data.vote.id,
                card_id: data.vote.cardId,
                user_id: data.vote.userId,
              },
            ]);
          }
        }
      }
    },
    [votes, currentUserId, retro.max_votes, retro.id]
  );

  const toggleDiscussed = useCallback(
    async (cardId: string) => {
      const result = await toggleDiscussedAction(cardId, retro.id);
      if (result?.error) return;
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId ? { ...c, is_discussed: !c.is_discussed } : c
        )
      );
    },
    [retro.id]
  );

  return (
    <div className="space-y-4 -mx-4 -mt-4">
      <RetroPhaseBar status={status} />

      {status !== "completed" && status !== "draft" && (
        <TimerDisplay
          retroId={retro.id}
          durationSeconds={retro.phase_timer_seconds}
          isFacilitator={isFacilitator}
        />
      )}

      <div className="px-4">
        {status !== "completed" && (
          <ParticipantBar retroId={retro.id} currentUserId={currentUserId} />
        )}
        {status === "draft" && (
          <RetroMetadata
            retroId={retro.id}
            location={retro.location}
            photoUrl={retro.photo_url}
            date={retro.date}
            isFacilitator={isFacilitator}
          />
        )}

        {(status === "draft" || status === "writing") && (
          <PhaseWriting
            categories={categories}
            cards={cards}
            currentUserId={currentUserId}
            status={status}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
          />
        )}

        {(status === "grouping" || status === "voting") && (
          <PhaseDiscussing
            categories={categories}
            cards={cards}
            votes={votes}
            currentUserId={currentUserId}
            showVoting={status === "voting"}
            onToggleVote={toggleVote}
            maxVotes={retro.max_votes}
          />
        )}

        {status === "discussing" && (
          <PhaseDiscussing
            categories={categories}
            cards={cards}
            votes={votes}
            currentUserId={currentUserId}
            showVoting={false}
            showDiscussed
            onToggleVote={toggleVote}
            onToggleDiscussed={toggleDiscussed}
            maxVotes={retro.max_votes}
          />
        )}

        {status === "actions" && (
          <PhaseActions
            retroId={retro.id}
            currentUserId={currentUserId}
          />
        )}

        {status === "completed" && (
          <div className="text-center py-8 space-y-3">
            <h2 className="text-xl font-semibold mb-2">Retro complete!</h2>
            <p className="text-muted-foreground">
              This retrospective has been completed.
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                render={
                  <a
                    href={`/app/${teamSlug}/retros/${retro.id}/stats`}
                  />
                }
              >
                View stats
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/api/retros/${retro.id}/export`, "_blank")
                }
              >
                Export CSV
              </Button>
            </div>
          </div>
        )}

        {isFacilitator && status !== "completed" && (
          <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 safe-bottom">
            <div className="max-w-lg mx-auto">
              <Button onClick={advancePhase} className="w-full">
                {status === "actions"
                  ? "Complete retro"
                  : `Next: ${
                      PHASE_ORDER[PHASE_ORDER.indexOf(status) + 1]
                    }`}
              </Button>
            </div>
          </div>
        )}
      </div>

      {showCompletion && (
        <RetroCompletionModal
          retro={retro}
          onComplete={handleComplete}
          onCancel={() => setShowCompletion(false)}
        />
      )}
    </div>
  );
}
