import { describe, it, expect } from 'vitest'
import {
  createTeamSchema,
  updateTeamSchema,
  createRetroSchema,
  createCardSchema,
  updateCardSchema,
  createActionItemSchema,
  updateActionItemSchema,
  createTagSchema,
  createVoteSchema,
  deleteVoteSchema,
  advancePhaseSchema,
  aiGroupSchema,
  csvImportRowSchema,
  PHASE_ORDER,
} from '../validators'

const validUuid = '550e8400-e29b-41d4-a716-446655440000'

describe('createTeamSchema', () => {
  it('accepts valid input', () => {
    const result = createTeamSchema.safeParse({ name: 'My Team', slug: 'my-team' })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = createTeamSchema.safeParse({ name: 'A', slug: 'my-team' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid slug', () => {
    const result = createTeamSchema.safeParse({ name: 'Team', slug: 'INVALID SLUG!' })
    expect(result.success).toBe(false)
  })

  it('rejects empty slug', () => {
    const result = createTeamSchema.safeParse({ name: 'Team', slug: '' })
    expect(result.success).toBe(false)
  })

  it('trims whitespace', () => {
    const result = createTeamSchema.safeParse({ name: '  Team  ', slug: 'team' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Team')
    }
  })
})

describe('updateTeamSchema', () => {
  it('accepts partial update', () => {
    expect(updateTeamSchema.safeParse({ name: 'New' }).success).toBe(true)
    expect(updateTeamSchema.safeParse({ slug: 'new' }).success).toBe(true)
    expect(updateTeamSchema.safeParse({}).success).toBe(true)
  })
})

describe('createRetroSchema', () => {
  it('accepts valid input with defaults', () => {
    const result = createRetroSchema.safeParse({
      team_id: validUuid,
      title: 'Sprint 10 Retro',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.template).toBe('mad_sad_glad')
      expect(result.data.max_votes).toBe(5)
    }
  })

  it('rejects empty title', () => {
    const result = createRetroSchema.safeParse({ team_id: validUuid, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid UUID', () => {
    const result = createRetroSchema.safeParse({ team_id: 'not-uuid', title: 'Test' })
    expect(result.success).toBe(false)
  })

  it('rejects timer below 30s', () => {
    const result = createRetroSchema.safeParse({
      team_id: validUuid,
      title: 'Test',
      phase_timer_seconds: 10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects timer above 3600s', () => {
    const result = createRetroSchema.safeParse({
      team_id: validUuid,
      title: 'Test',
      phase_timer_seconds: 7200,
    })
    expect(result.success).toBe(false)
  })

  it('accepts all valid templates', () => {
    for (const tmpl of ['went_well_improve', 'mad_sad_glad', 'start_stop_continue', 'four_ls', 'custom']) {
      const result = createRetroSchema.safeParse({ team_id: validUuid, title: 'T', template: tmpl })
      expect(result.success).toBe(true)
    }
  })
})

describe('createCardSchema', () => {
  it('accepts valid input', () => {
    const result = createCardSchema.safeParse({
      retro_id: validUuid,
      category_id: validUuid,
      text: 'Good teamwork',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty text', () => {
    const result = createCardSchema.safeParse({
      retro_id: validUuid,
      category_id: validUuid,
      text: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects text over 2000 chars', () => {
    const result = createCardSchema.safeParse({
      retro_id: validUuid,
      category_id: validUuid,
      text: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })
})

describe('updateCardSchema', () => {
  it('accepts partial updates', () => {
    expect(updateCardSchema.safeParse({ text: 'Updated' }).success).toBe(true)
    expect(updateCardSchema.safeParse({ is_discussed: true }).success).toBe(true)
    expect(updateCardSchema.safeParse({ sort_order: 3 }).success).toBe(true)
    expect(updateCardSchema.safeParse({}).success).toBe(true)
  })

  it('rejects negative sort_order', () => {
    expect(updateCardSchema.safeParse({ sort_order: -1 }).success).toBe(false)
  })
})

describe('createActionItemSchema', () => {
  it('accepts valid input', () => {
    const result = createActionItemSchema.safeParse({
      retro_id: validUuid,
      text: 'Fix CI pipeline',
    })
    expect(result.success).toBe(true)
  })

  it('rejects text over 500 chars', () => {
    const result = createActionItemSchema.safeParse({
      retro_id: validUuid,
      text: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('allows optional assignee and due_date', () => {
    const result = createActionItemSchema.safeParse({
      retro_id: validUuid,
      text: 'Do thing',
      assignee_id: validUuid,
      due_date: '2026-04-01',
    })
    expect(result.success).toBe(true)
  })
})

describe('updateActionItemSchema', () => {
  it('accepts status transitions', () => {
    for (const status of ['open', 'in_progress', 'done']) {
      expect(updateActionItemSchema.safeParse({ status }).success).toBe(true)
    }
  })

  it('rejects invalid status', () => {
    expect(updateActionItemSchema.safeParse({ status: 'invalid' }).success).toBe(false)
  })
})

describe('createTagSchema', () => {
  it('accepts valid tag', () => {
    const result = createTagSchema.safeParse({ team_id: validUuid, name: 'bug' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createTagSchema.safeParse({ team_id: validUuid, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name over 30 chars', () => {
    const result = createTagSchema.safeParse({ team_id: validUuid, name: 'a'.repeat(31) })
    expect(result.success).toBe(false)
  })
})

describe('createVoteSchema / deleteVoteSchema', () => {
  it('accepts valid UUIDs', () => {
    expect(createVoteSchema.safeParse({ card_id: validUuid }).success).toBe(true)
    expect(deleteVoteSchema.safeParse({ vote_id: validUuid }).success).toBe(true)
  })

  it('rejects invalid UUIDs', () => {
    expect(createVoteSchema.safeParse({ card_id: 'bad' }).success).toBe(false)
    expect(deleteVoteSchema.safeParse({ vote_id: 'bad' }).success).toBe(false)
  })
})

describe('advancePhaseSchema', () => {
  it('accepts all valid phases', () => {
    for (const phase of PHASE_ORDER) {
      expect(advancePhaseSchema.safeParse({ target_status: phase }).success).toBe(true)
    }
  })

  it('rejects invalid phase', () => {
    expect(advancePhaseSchema.safeParse({ target_status: 'invalid' }).success).toBe(false)
  })
})

describe('aiGroupSchema', () => {
  it('accepts valid retro_id', () => {
    expect(aiGroupSchema.safeParse({ retro_id: validUuid }).success).toBe(true)
  })

  it('rejects invalid retro_id', () => {
    expect(aiGroupSchema.safeParse({ retro_id: 'bad' }).success).toBe(false)
  })
})

describe('csvImportRowSchema', () => {
  it('accepts valid row', () => {
    const result = csvImportRowSchema.safeParse({ category: 'Good', text: 'Nice work' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toBe('')
    }
  })

  it('rejects missing category', () => {
    expect(csvImportRowSchema.safeParse({ category: '', text: 'x' }).success).toBe(false)
  })

  it('rejects missing text', () => {
    expect(csvImportRowSchema.safeParse({ category: 'Good', text: '' }).success).toBe(false)
  })
})

describe('PHASE_ORDER', () => {
  it('has 7 phases in correct order', () => {
    expect(PHASE_ORDER).toEqual([
      'draft', 'writing', 'grouping', 'voting', 'discussing', 'actions', 'completed',
    ])
  })
})
