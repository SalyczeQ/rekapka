"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { SerializedRetro, SerializedCategory, SerializedCard, SerializedActionItem, SerializedPrediction } from "@/types/serialized";
import type { SSEEvent } from "@/types/realtime";
import { vibrate } from "@/lib/haptics";
import { useRetroStream } from "@/hooks/use-retro-stream";
import { PhaseBar } from "./phase-bar";
import { PhaseWriting } from "./phase-writing";
import { PhaseDiscussing } from "./phase-discussing";
import { ParticipantBar } from "./participant-bar";
import { CompletionModal } from "./completion-modal";
import { PredictionSection } from "./prediction-section";

export type { SerializedRetro, SerializedCategory, SerializedCard, SerializedActionItem, SerializedPrediction };

interface RetroSessionProps {
  retro: SerializedRetro;
  categories: SerializedCategory[];
  initialCards: SerializedCard[];
  initialActionItems: SerializedActionItem[];
  initialPredictions: SerializedPrediction[];
  unresolvedPredictions: SerializedPrediction[];
  initialReactions: Record<string, Record<string, number>>;
  initialUserReactions: Record<string, string[]>;
  currentUserId: string;
  currentUserEmail?: string;
  allUsers: { id: string; name: string; color: string; image: string | null }[];
  photoUrl?: string | null;
  dictationEnabled?: boolean;
  reactionSoundsEnabled?: boolean;
}

export function RetroSession({
  retro,
  categories,
  initialCards,
  initialActionItems,
  initialPredictions,
  unresolvedPredictions: initialUnresolved,
  initialReactions,
  initialUserReactions,
  currentUserId,
  currentUserEmail,
  allUsers,
  photoUrl,
  dictationEnabled = true,
  reactionSoundsEnabled = false,
}: RetroSessionProps) {
  const t = useTranslations();
  const [currentCards, setCards] = useState(initialCards);
  const [currentPhase, setCurrentPhase] = useState(retro.status);
  const [currentRetro, setCurrentRetro] = useState(retro);
  const [actionItems, setActionItems] = useState(initialActionItems);
  const [predictions, setPredictions] = useState(initialPredictions);
  const [unresolvedPredictions, setUnresolvedPredictions] = useState(initialUnresolved);
  const [reactions, setReactions] = useState(initialReactions);
  const [userReactions] = useState(initialUserReactions);

  const handleSSEEvent = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case "card_added":
        setCards((prev) => {
          if (prev.some((c) => c.id === event.card.id)) return prev;
          vibrate(30);
          return [...prev, event.card];
        });
        break;
      case "card_updated":
        setCards((prev) =>
          prev.map((c) =>
            c.id === event.cardId ? { ...c, ...event.changes } : c
          )
        );
        break;
      case "card_deleted":
        setCards((prev) => prev.filter((c) => c.id !== event.cardId));
        break;
      case "phase_changed":
        setCurrentPhase(event.phase);
        break;
      case "group_updated":
        setCards((prev) => {
          const labelMap = new Map(
            event.cards.map((c) => [c.cardId, c.groupLabel])
          );
          return prev.map((card) => {
            const newLabel = labelMap.get(card.id);
            return newLabel !== undefined
              ? { ...card, groupLabel: newLabel as string }
              : card;
          });
        });
        break;
      case "discussion_update":
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== event.cardId) return c;
            switch (event.action) {
              case "done":
                return { ...c, isDiscussed: true };
              case "skip":
                return { ...c, isSkipped: true };
              case "unskip":
                return { ...c, isSkipped: false };
              case "start":
                return { ...c, discussionStartedAt: new Date().toISOString() };
              default:
                return c;
            }
          })
        );
        break;
      case "action_item_added":
        setActionItems((prev) => {
          if (prev.some((a) => a.id === event.item.id)) return prev;
          return [...prev, {
            ...event.item,
            assigneeName: allUsers.find((u) => u.id === event.item.assigneeId)?.name ?? null,
            createdAt: new Date().toISOString(),
          }];
        });
        break;
      case "action_item_updated":
        setActionItems((prev) =>
          prev.map((a) =>
            a.id === event.itemId ? { ...a, ...event.changes } : a
          )
        );
        break;
      case "action_item_deleted":
        setActionItems((prev) => prev.filter((a) => a.id !== event.itemId));
        break;
      case "reactions_updated":
        setReactions((prev) => ({
          ...prev,
          [event.cardId]: event.reactions,
        }));
        break;
      case "retro_updated":
        setCurrentRetro((prev) => ({ ...prev, ...event.changes }));
        break;
      case "prediction_added":
        setPredictions((prev) => {
          if (prev.some((p) => p.id === event.prediction.id)) return prev;
          return [...prev, {
            ...event.prediction,
            authorColor: allUsers.find((u) => u.id === event.prediction.authorId)?.color ?? "#888",
            resolvedInRetroId: null,
          }];
        });
        break;
      case "prediction_resolved":
        setPredictions((prev) =>
          prev.map((p) => p.id === event.predictionId ? { ...p, status: event.status } : p)
        );
        setUnresolvedPredictions((prev) =>
          prev.map((p) => p.id === event.predictionId ? { ...p, status: event.status } : p)
        );
        break;
    }
  }, [allUsers]);

  const { connected, presence } = useRetroStream({
    retroId: retro.id,
    onEvent: handleSSEEvent,
  });

  const onlineUserIds = new Set(presence.map((u) => u.id));
  const participantList = allUsers.map((u) => ({
    ...u,
    online: onlineUserIds.size > 0 ? onlineUserIds.has(u.id) : u.id === currentUserId,
  }));

  return (
    <div className="flex flex-col h-full">
      <PhaseBar currentPhase={currentPhase} retroId={retro.id} onPhaseChange={setCurrentPhase} currentUserEmail={currentUserEmail} />
      <div className="px-4 py-1 flex items-center justify-end gap-2">
        {!connected && (
          <span className="text-xs text-muted-foreground">{t("common.reconnecting")}</span>
        )}
        <ParticipantBar participants={participantList} />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6" key={currentPhase}>
        {currentPhase === "writing" && (
          <PhaseWriting
            retro={currentRetro}
            categories={categories}
            cards={currentCards}
            currentUserId={currentUserId}
            currentUser={allUsers.find((u) => u.id === currentUserId) ?? { id: currentUserId, name: t("common.you"), color: "#888", image: null }}
            onCardsChange={setCards}
            dictationEnabled={dictationEnabled}
          />
        )}

        {currentPhase === "discussing" && (
          <PhaseDiscussing
            retro={currentRetro}
            categories={categories}
            cards={currentCards}
            actionItems={actionItems}
            currentUserId={currentUserId}
            allUsers={allUsers}
            onCardsChange={setCards}
            onActionItemsChange={setActionItems}
            dictationEnabled={dictationEnabled}
            reactions={reactions}
            userReactions={userReactions}
            reactionSoundsEnabled={reactionSoundsEnabled}
          />
        )}

        {(currentPhase === "writing" || currentPhase === "discussing") && (
          <div className="max-w-2xl mx-auto">
          <PredictionSection
            retroId={retro.id}
            predictions={predictions}
            unresolvedFromPast={unresolvedPredictions}
            currentUserId={currentUserId}
            allUsers={allUsers}
            onPredictionsChange={setPredictions}
            onUnresolvedChange={setUnresolvedPredictions}
          />
          </div>
        )}

        {currentPhase === "completed" && (
          <CompletionModal
            retro={currentRetro}
            categories={categories}
            cards={currentCards}
            actionItems={actionItems}
            allUsers={allUsers}
            initialPhotoUrl={photoUrl}
            currentUserEmail={currentUserEmail}
            reactions={reactions}
          />
        )}
      </div>
    </div>
  );
}
