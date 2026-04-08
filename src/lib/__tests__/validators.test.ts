import { describe, it, expect } from "vitest";
import {
  createRetroSchema,
  createCardSchema,
  createActionItemSchema,
  tagSchema,
} from "@/lib/validators";

describe("createRetroSchema", () => {
  it("validates valid input", () => {
    const result = createRetroSchema.safeParse({
      title: "Sprint 42",
      date: "2024-03-15",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createRetroSchema.safeParse({
      title: "",
      date: "2024-03-15",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional location", () => {
    const result = createRetroSchema.safeParse({
      title: "Retro",
      date: "2024-03-15",
      location: "Office",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.location).toBe("Office");
    }
  });

  it("coerces date string to Date", () => {
    const result = createRetroSchema.safeParse({
      title: "Retro",
      date: "2024-03-15",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });
});

describe("createCardSchema", () => {
  it("validates valid card", () => {
    const result = createCardSchema.safeParse({
      retroId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "550e8400-e29b-41d4-a716-446655440001",
      text: "Something went well",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty text", () => {
    const result = createCardSchema.safeParse({
      retroId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "550e8400-e29b-41d4-a716-446655440001",
      text: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID", () => {
    const result = createCardSchema.safeParse({
      retroId: "not-a-uuid",
      categoryId: "550e8400-e29b-41d4-a716-446655440001",
      text: "test",
    });
    expect(result.success).toBe(false);
  });
});

describe("createActionItemSchema", () => {
  it("validates minimal input", () => {
    const result = createActionItemSchema.safeParse({
      retroId: "550e8400-e29b-41d4-a716-446655440000",
      text: "Fix the bug",
    });
    expect(result.success).toBe(true);
  });

  it("validates with optional fields", () => {
    const result = createActionItemSchema.safeParse({
      retroId: "550e8400-e29b-41d4-a716-446655440000",
      text: "Fix the bug",
      cardId: "550e8400-e29b-41d4-a716-446655440001",
      assigneeId: "550e8400-e29b-41d4-a716-446655440002",
      dueDate: "2024-04-01",
    });
    expect(result.success).toBe(true);
  });
});

describe("tagSchema", () => {
  it("validates tag name", () => {
    expect(tagSchema.safeParse({ name: "team" }).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(tagSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("trims whitespace", () => {
    const result = tagSchema.safeParse({ name: "  team  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("team");
    }
  });
});
