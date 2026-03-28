import { z } from 'zod'

// --- Team ---

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name must be at most 50 characters')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .trim(),
})

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name must be at most 50 characters')
    .trim()
    .optional(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .trim()
    .optional(),
})

// --- Retro ---

export const retroStatusEnum = z.enum([
  'draft',
  'writing',
  'grouping',
  'voting',
  'discussing',
  'actions',
  'completed',
])

export const retroTemplateEnum = z.enum([
  'went_well_improve',
  'mad_sad_glad',
  'start_stop_continue',
  'four_ls',
  'custom',
])

export const createRetroSchema = z.object({
  team_id: z.string().uuid('Invalid team ID'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title must be at most 120 characters')
    .trim(),
  template: retroTemplateEnum.default('mad_sad_glad'),
  location: z.string().max(200).trim().nullish(),
  date: z.string().date('Invalid date format').optional(),
  phase_timer_seconds: z
    .number()
    .int()
    .min(30, 'Timer must be at least 30 seconds')
    .max(3600, 'Timer must be at most 1 hour')
    .nullish(),
  max_votes: z
    .number()
    .int()
    .min(1, 'Must allow at least 1 vote')
    .max(99, 'Max votes must be at most 99')
    .default(5),
})

// --- Card ---

export const createCardSchema = z.object({
  retro_id: z.string().uuid('Invalid retro ID'),
  category_id: z.string().uuid('Invalid category ID'),
  text: z
    .string()
    .min(1, 'Card text is required')
    .max(2000, 'Card text must be at most 2000 characters')
    .trim(),
})

export const updateCardSchema = z.object({
  text: z
    .string()
    .min(1, 'Card text is required')
    .max(2000, 'Card text must be at most 2000 characters')
    .trim()
    .optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  sort_order: z.number().int().min(0).optional(),
  group_label: z.string().max(100).trim().nullish(),
  is_discussed: z.boolean().optional(),
})

// --- Action Item ---

export const actionStatusEnum = z.enum(['open', 'in_progress', 'done'])

export const createActionItemSchema = z.object({
  retro_id: z.string().uuid('Invalid retro ID'),
  text: z
    .string()
    .min(1, 'Action item text is required')
    .max(500, 'Action item text must be at most 500 characters')
    .trim(),
  assignee_id: z.string().uuid('Invalid assignee ID').nullish(),
  due_date: z.string().date('Invalid date format').nullish(),
})

export const updateActionItemSchema = z.object({
  text: z
    .string()
    .min(1, 'Action item text is required')
    .max(500, 'Action item text must be at most 500 characters')
    .trim()
    .optional(),
  assignee_id: z.string().uuid('Invalid assignee ID').nullish(),
  due_date: z.string().date('Invalid date format').nullish(),
  status: actionStatusEnum.optional(),
})

// --- Tag ---

export const createTagSchema = z.object({
  team_id: z.string().uuid('Invalid team ID'),
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(30, 'Tag name must be at most 30 characters')
    .trim(),
})

// --- Vote ---

export const createVoteSchema = z.object({
  card_id: z.string().uuid('Invalid card ID'),
})

export const deleteVoteSchema = z.object({
  vote_id: z.string().uuid('Invalid vote ID'),
})

// --- Phase ---

export const PHASE_ORDER = [
  'draft',
  'writing',
  'grouping',
  'voting',
  'discussing',
  'actions',
  'completed',
] as const

export const advancePhaseSchema = z.object({
  target_status: retroStatusEnum,
})

// --- AI ---

export const aiGroupSchema = z.object({
  retro_id: z.string().uuid('Invalid retro ID'),
})

export const aiStatsSchema = z.object({
  retro_id: z.string().uuid('Invalid retro ID'),
})

// --- CSV Import ---

export const csvImportRowSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  text: z.string().min(1, 'Text is required').max(2000),
  tags: z.string().optional().default(''),
})

// --- Inferred types ---

export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
export type CreateRetroInput = z.infer<typeof createRetroSchema>
export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
export type CreateActionItemInput = z.infer<typeof createActionItemSchema>
export type UpdateActionItemInput = z.infer<typeof updateActionItemSchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type CreateVoteInput = z.infer<typeof createVoteSchema>
export type AdvancePhaseInput = z.infer<typeof advancePhaseSchema>
export type AiGroupInput = z.infer<typeof aiGroupSchema>
export type AiStatsInput = z.infer<typeof aiStatsSchema>
export type CsvImportRow = z.infer<typeof csvImportRowSchema>
