"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type UITheme = "default" | "cli" | "msdos" | "material3" | "windows";

interface UIThemeContextValue {
  uiTheme: UITheme;
  setUITheme: (theme: UITheme) => void;
}

const UIThemeContext = createContext<UIThemeContextValue>({
  uiTheme: "default",
  setUITheme: () => {},
});

export function useUITheme() {
  return useContext(UIThemeContext);
}

function UIThemeProvider({ children }: { children: React.ReactNode }) {
  const [uiTheme, setUIThemeState] = useState<UITheme>("default");

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith("ui-theme="))
      ?.split("=")[1] as UITheme | undefined;
    if (stored) {
      document.documentElement.setAttribute("data-ui-theme", stored);
    }
    // Schedule state update in timer callback to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      if (stored) setUIThemeState(stored);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setUITheme = useCallback((theme: UITheme) => {
    setUIThemeState(theme);
    document.documentElement.setAttribute("data-ui-theme", theme);
    document.cookie = `ui-theme=${theme};path=/;max-age=31536000`;
  }, []);

  return (
    <UIThemeContext.Provider value={{ uiTheme, setUITheme }}>
      {children}
    </UIThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UIThemeProvider>{children}</UIThemeProvider>
    </NextThemesProvider>
  );
}
