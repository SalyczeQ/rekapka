import { describe, it, expect } from "vitest";
import { getColorForIndex, getContrastColor, CARD_COLORS } from "@/lib/colors";

describe("getColorForIndex", () => {
  it("returns first color for index 0", () => {
    expect(getColorForIndex(0)).toBe(CARD_COLORS[0]);
  });

  it("wraps around for large indices", () => {
    expect(getColorForIndex(10)).toBe(CARD_COLORS[0]);
    expect(getColorForIndex(11)).toBe(CARD_COLORS[1]);
  });
});

describe("getContrastColor", () => {
  it("returns white for dark colors", () => {
    expect(getContrastColor("#000000")).toBe("#FFFFFF");
    expect(getContrastColor("#333333")).toBe("#FFFFFF");
  });

  it("returns black for light colors", () => {
    expect(getContrastColor("#FFFFFF")).toBe("#000000");
    expect(getContrastColor("#F5F5F5")).toBe("#000000");
  });
});
