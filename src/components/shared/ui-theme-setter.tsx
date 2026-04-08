"use client";

import { useEffect } from "react";

/**
 * Sets the `data-ui-theme` attribute on <html> for CSS theme selectors.
 * Runs client-side to avoid SSR/hydration issues with next-themes.
 */
export function UIThemeSetter({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-ui-theme", theme);
  }, [theme]);

  return null;
}
