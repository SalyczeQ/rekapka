import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  requireRetroTeamMember: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}))

import { cycleActionStatusAction } from '../action-items'
import { requireRetroTeamMember } from '@/lib/auth/session'
import { db } from '@/lib/db'

describe('cycleActionStatusAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when action item not found', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await cycleActionStatusAction('bad-id', 'open')
    expect(result).toEqual({ error: 'Action item not found' })
  })

  it('returns error when not a team member', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ retroId: 'r1' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ error: 'Forbidden' } as any)

    const result = await cycleActionStatusAction('a1', 'open')
    expect(result).toEqual({ error: 'Forbidden' })
  })

  it('cycles open -> in_progress', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ retroId: 'r1' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await cycleActionStatusAction('a1', 'open')
    expect(result).toEqual({ status: 'in_progress' })
  })

  it('cycles in_progress -> done', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ retroId: 'r1' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await cycleActionStatusAction('a1', 'in_progress')
    expect(result).toEqual({ status: 'done' })
  })

  it('cycles done -> open', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ retroId: 'r1' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)
    vi.mocked(requireRetroTeamMember).mockResolvedValue({ userId: 'u1', teamId: 't1', role: 'member' } as any)

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await cycleActionStatusAction('a1', 'done')
    expect(result).toEqual({ status: 'open' })
  })
})
