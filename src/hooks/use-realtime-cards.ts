"use client";

import { useEffect, useState, useCallback } from "react";

interface Card {
  id: string;
  retro_id: string;
  text: string;
  author_id: string;
  category_id: string;
  sort_order: number;
  group_label: string | null;
  is_discussed: boolean;
  carried_from_retro_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useRealtimeCards(retroId: string) {
  const [cards, setCards] = useState<Card[]>([]);

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(`/api/retros/${retroId}/cards`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.cards) setCards(data.cards);
    } catch {
      // Silently ignore polling errors
    }
  }, [retroId]);

  useEffect(() => {
    const timer = setTimeout(fetchCards, 0);
    const interval = setInterval(fetchCards, 3000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [fetchCards]);

  return cards;
}
