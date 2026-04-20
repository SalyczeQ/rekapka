"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Ctx {
  title: string | null;
  setTitle: (title: string | null) => void;
}

const RetroHeaderContext = createContext<Ctx>({ title: null, setTitle: () => {} });

export function RetroHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  return (
    <RetroHeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </RetroHeaderContext.Provider>
  );
}

export function useRetroHeaderTitle() {
  return useContext(RetroHeaderContext).title;
}

export function useSetRetroHeaderTitle(title: string | null) {
  const { setTitle } = useContext(RetroHeaderContext);
  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);
}
