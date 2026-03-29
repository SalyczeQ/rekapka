"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { deleteCardAction, toggleDiscussedAction, updateCardTextAction, getActionItemsAction, updateGroupLabelAction, updateDiscussionNotesAction } from "@/lib/actions/retro-session";
import { RetroPhaseBar } from "./retro-phase-bar";
import { PhaseWriting } from "./phase-writing";
import { PhaseDiscussing } from "./phase-discussing";
import { PhaseActions } from "./phase-actions";
import { TimerDisplay } from "./timer-display";
import { ParticipantBar } from "./participant-bar";
import { RetroMetadata } from "./retro-metadata";
import { DeleteRetroButton } from "./delete-retro-button";
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
    created_by: string;
    team_id: string;
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
    discussion_notes?: string | null;
    created_at: string;
  }[];
  initialVotes: {
    id: string;
    card_id: string;
    user_id: string;
  }[];
  currentUserId: string;
  currentUserName: string;
  userRole: string;
  teamSlug: string;
}

export function RetroSession({
  retro,
  categories,
  initialCards,
  initialVotes,
  currentUserId,
  currentUserName,
  userRole,
  teamSlug,
}: RetroSessionProps) {
  const [status, setStatus] = useState<RetroStatus>(
    retro.status as RetroStatus
  );
  const [cards, setCards] = useState(initialCards);
  const [votes, setVotes] = useState(initialVotes);
  const [showCompletion, setShowCompletion] = useState(false);
  const [actionItemCount, setActionItemCount] = useState(0);
  const [retroTitle, setRetroTitle] = useState(retro.title);
  const isFacilitator =
    userRole === "owner" ||
    userRole === "facilitator" ||
    retro.created_by === currentUserId;
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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

  const editCard = useCallback(
    async (cardId: string, text: string) => {
      const result = await updateCardTextAction(cardId, retro.id, text);
      if (result?.error) {
        toast.error("Failed to update card");
        return;
      }
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, text } : c))
      );
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

  const updateGroupLabel = useCallback(
    async (cardId: string, label: string) => {
      await updateGroupLabelAction(cardId, retro.id, label);
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, group_label: label || null } : c))
      );
    },
    [retro.id]
  );

  const updateCardNotes = useCallback(
    async (cardId: string, notes: string) => {
      await updateDiscussionNotesAction(cardId, retro.id, notes);
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, discussion_notes: notes } : c))
      );
    },
    [retro.id]
  );

  const refreshCards = useCallback(async () => {
    try {
      const res = await fetch(`/api/retros/${retro.id}/cards`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.cards) setCards(data.cards);
    } catch { /* ignore */ }
  }, [retro.id]);

  const goBackPhase = useCallback(async () => {
    const currentIndex = PHASE_ORDER.indexOf(status);
    if (currentIndex <= 1) return; // Don't go back to draft
    const prevStatus = PHASE_ORDER[currentIndex - 1];

    const res = await fetch(`/api/retros/${retro.id}/phase`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_status: prevStatus }),
    });

    if (!res.ok) {
      toast.error("Failed to go back");
      return;
    }

    setStatus(prevStatus);
  }, [status, retro.id]);

  // Fetch action item count when retro completes
  useEffect(() => {
    if (status !== "completed") return;
    getActionItemsAction(retro.id).then((r) =>
      setActionItemCount(r?.items?.length ?? 0)
    );
  }, [status, retro.id]);

  // Completion summary stats
  const completionStats = useMemo(() => {
    const totalCards = cards.length;
    const totalVotes = votes.length;
    const participants = new Set(cards.map((c) => c.author_id)).size;
    const topCards = [...cards]
      .map((c) => ({
        ...c,
        voteCount: votes.filter((v) => v.card_id === c.id).length,
      }))
      .filter((c) => c.voteCount > 0)
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 3);
    return { totalCards, totalVotes, participants, topCards };
  }, [cards, votes]);

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
          <ParticipantBar retroId={retro.id} currentUserId={currentUserId} currentUserName={currentUserName} />
        )}
        {status === "draft" && (
          <RetroMetadata
            retroId={retro.id}
            title={retroTitle}
            location={retro.location}
            photoUrl={null}
            date={retro.date}
            isFacilitator={isFacilitator}
            hidePhoto
            onTitleChange={setRetroTitle}
          />
        )}
        {status === "actions" && (
          <RetroMetadata
            retroId={retro.id}
            title={retroTitle}
            location={retro.location}
            photoUrl={retro.photo_url}
            date={retro.date}
            isFacilitator={isFacilitator}
            onTitleChange={setRetroTitle}
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
            onEditCard={editCard}
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
            isFacilitator={isFacilitator}
            retroId={retro.id}
            isGroupingPhase={status === "grouping"}
            onCardsRefresh={refreshCards}
            onEditGroupLabel={status === "grouping" ? updateGroupLabel : undefined}
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
            showNotes
            onToggleVote={toggleVote}
            onToggleDiscussed={toggleDiscussed}
            onEditNotes={updateCardNotes}
            maxVotes={retro.max_votes}
          />
        )}

        {status === "actions" && (
          <PhaseActions
            retroId={retro.id}
            currentUserId={currentUserId}
            teamId={retro.team_id}
          />
        )}

        {status === "completed" && (
          <div className="py-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">Retro complete!</h2>
              <p className="text-sm text-muted-foreground">
                {retroTitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Cards", value: completionStats.totalCards },
                { label: "Votes", value: completionStats.totalVotes },
                { label: "Participants", value: completionStats.participants },
                { label: "Actions", value: actionItemCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border bg-card p-3 text-center"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {completionStats.topCards.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Top voted
                </h3>
                {completionStats.topCards.map((card, i) => (
                  <div
                    key={card.id}
                    className="flex items-start gap-2 rounded-lg border bg-card p-3"
                  >
                    <span className="text-sm font-bold text-muted-foreground shrink-0">
                      #{i + 1}
                    </span>
                    <p className="text-sm flex-1">{card.text}</p>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      {card.voteCount} {card.voteCount === 1 ? "vote" : "votes"}
                    </span>
                  </div>
                ))}
              </div>
            )}

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
            <div className="max-w-lg mx-auto space-y-2">
              {status === "draft" && (
                <div className="flex justify-center">
                  <DeleteRetroButton retroId={retro.id} teamSlug={teamSlug} variant="full" />
                </div>
              )}
              <div className="flex gap-2">
                {status !== "draft" && status !== "writing" && (
                  <Button variant="outline" onClick={goBackPhase} className="flex-1">
                    Back: {PHASE_ORDER[PHASE_ORDER.indexOf(status) - 1]}
                  </Button>
                )}
                <Button onClick={advancePhase} className="flex-1">
                  {status === "actions"
                    ? "Complete retro"
                    : `Next: ${
                        PHASE_ORDER[PHASE_ORDER.indexOf(status) + 1]
                      }`}
                </Button>
              </div>
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
