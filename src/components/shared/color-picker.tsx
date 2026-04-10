"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CARD_COLORS } from "@/lib/colors";

interface ColorPickerProps {
  name: string;
  defaultValue: string;
}

export function ColorPicker({ name, defaultValue }: ColorPickerProps) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="flex flex-wrap gap-2">
      <input type="hidden" name={name} value={selected} />
      {CARD_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          data-color-swatch
          onClick={() => setSelected(color)}
          className="w-8 h-8 shrink-0 flex items-center justify-center transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
          style={{
            backgroundColor: color,
            borderRadius: "9999px",
            border: selected === color ? "2px solid white" : `2px solid ${color}`,
            boxShadow: selected === color ? `0 0 0 2px ${color}` : "none",
          }}
          aria-label={color}
        >
          {selected === color && (
            <Check className="h-4 w-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" style={{ color: "white" }} aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
