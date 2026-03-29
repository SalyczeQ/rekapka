import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  requireRetroTeamMember: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    insert: vi.fn(),
  },
}))

import {
  updateRetroMetadataAction,
  deleteCardAction,
  toggleDiscussedAction,
  addActionItemAction,
  getActionItemsAction,
} from '../retro-session'
import { requireRetroTeamMember } from '@/lib/auth/session'
import { db } from '@/lib/db'

describe('updateRetroMetadataAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns error when not authorized', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Not authenticated' } as any)
    const result = await updateRetroMetadataAction('r1', { location: 'Room A' })
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('updates metadata on success', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await updateRetroMetadataAction('r1', { location: 'Room A' })
    expect(result).toEqual({ success: true })
  })
})

describe('deleteCardAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns error when not authorized', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Forbidden' } as any)
    const result = await deleteCardAction('c1', 'r1')
    expect(result).toEqual({ error: 'Forbidden' })
  })

  it('deletes card on success', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const deleteChain = { where: vi.fn().mockResolvedValue(undefined) }
    vi.mocked(db.delete).mockReturnValue(deleteChain as any)

    const result = await deleteCardAction('c1', 'r1')
    expect(result).toEqual({ success: true })
  })
})

describe('toggleDiscussedAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns error when not authorized', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Not authenticated' } as any)
    const result = await toggleDiscussedAction('c1', 'r1')
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('returns error when card not found', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await toggleDiscussedAction('c1', 'r1')
    expect(result).toEqual({ error: 'Card not found' })
  })

  it('toggles discussed state', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ isDiscussed: false }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await toggleDiscussedAction('c1', 'r1')
    expect(result).toEqual({ success: true })
  })
})

describe('addActionItemAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns error when not authorized', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Forbidden' } as any)
    const result = await addActionItemAction('r1', 'Do thing', 'u2')
    expect(result).toEqual({ error: 'Forbidden' })
  })

  it('adds action item on success', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const mockItem = { id: 'ai1', text: 'Do thing', retroId: 'r1' }
    const insertChain = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockItem]),
    }
    vi.mocked(db.insert).mockReturnValue(insertChain as any)

    const result = await addActionItemAction('r1', 'Do thing', 'u2')
    expect(result).toEqual({ item: mockItem })
  })
})

describe('getActionItemsAction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns empty items when not authorized', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Forbidden' } as any)
    const result = await getActionItemsAction('r1')
    expect(result).toEqual({ items: [] })
  })

  it('returns mapped action items', async () => {
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)
    const mockItems = [
      { id: 'ai1', text: 'Fix bug', assigneeId: 'u2', dueDate: '2026-04-01', status: 'open', createdAt: new Date() },
    ]
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockItems),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await getActionItemsAction('r1')
    expect(result.items).toEqual([
      { id: 'ai1', text: 'Fix bug', assignee_id: 'u2', due_date: '2026-04-01', status: 'open' },
    ])
  })
})
