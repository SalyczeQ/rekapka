import { z } from "zod";

export const createRetroSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  date: z.coerce.date(),
  location: z.string().max(500).optional(),
});

export const updateRetroSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  location: z.string().max(500).optional(),
  date: z.coerce.date().optional(),
});

export const createCardSchema = z.object({
  retroId: z.string().uuid(),
  categoryId: z.string().uuid(),
  text: z.string().min(1, "Card text is required").max(2000),
});

export const updateCardSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  categoryId: z.string().uuid().optional(),
  discussionNotes: z.string().max(5000).optional(),
});

export const createActionItemSchema = z.object({
  retroId: z.string().uuid(),
  cardId: z.string().uuid().optional(),
  text: z.string().min(1, "Action item text is required").max(1000),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.coerce.date().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export type CreateRetroInput = z.infer<typeof createRetroSchema>;
export type UpdateRetroInput = z.infer<typeof updateRetroSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CreateActionItemInput = z.infer<typeof createActionItemSchema>;
