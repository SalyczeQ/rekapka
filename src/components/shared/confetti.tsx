"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { x: 0.5, y: 0.5 },
    gravity: 0.8,
    ticks: 200,
  });
}

export function Confetti() {
  useEffect(() => {
    triggerConfetti();
  }, []);

  return null;
}
