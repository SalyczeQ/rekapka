"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  const fetchCards = useCallback(async () => {
    const { data } = await supabase
      .from("cards")
      .select("*")
      .eq("retro_id", retroId)
      .order("created_at", { ascending: true });
    setCards(data ?? []);
  }, [retroId, supabase]);

  useEffect(() => {
    fetchCards();

    const channel = supabase
      .channel(`cards:${retroId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "cards",
          filter: `retro_id=eq.${retroId}`,
        },
        (payload) => {
          setCards((prev) => [...prev, payload.new as Card]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cards",
          filter: `retro_id=eq.${retroId}`,
        },
        (payload) => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === (payload.new as Card).id ? (payload.new as Card) : c
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "cards",
          filter: `retro_id=eq.${retroId}`,
        },
        (payload) => {
          setCards((prev) =>
            prev.filter((c) => c.id !== (payload.old as { id: string }).id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retroId, supabase, fetchCards]);

  return cards;
}
