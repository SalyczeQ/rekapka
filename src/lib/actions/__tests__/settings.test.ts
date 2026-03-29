import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  requireTeamMember: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    update: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
  },
}))

import { updateTeamNameAction, inviteMemberAction } from '../settings'
import { requireTeamMember } from '@/lib/auth/session'
import { db } from '@/lib/db'

describe('updateTeamNameAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when requireTeamMember fails', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ error: 'Forbidden' } as any)
    const result = await updateTeamNameAction('t1', 'New Name')
    expect(result).toEqual({ error: 'Forbidden' })
  })

  it('returns error for non-owner/facilitator', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'member' } as any)
    const result = await updateTeamNameAction('t1', 'New Name')
    expect(result).toEqual({ error: 'Only owners and facilitators can rename the team.' })
  })

  it('returns error for short name', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)
    const result = await updateTeamNameAction('t1', 'A')
    expect(result).toEqual({ error: 'Name must be at least 2 characters.' })
  })

  it('updates team name for owner', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)
    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await updateTeamNameAction('t1', 'New Name')
    expect(result).toEqual({ success: true })
    expect(db.update).toHaveBeenCalled()
  })

  it('updates team name for facilitator', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'facilitator' } as any)
    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const result = await updateTeamNameAction('t1', 'Updated')
    expect(result).toEqual({ success: true })
  })
})

describe('inviteMemberAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when not authorized', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ error: 'Not authenticated' } as any)
    const result = await inviteMemberAction('t1', 'a@b.com')
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('returns error for non-owner/facilitator', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'member' } as any)
    const result = await inviteMemberAction('t1', 'a@b.com')
    expect(result).toEqual({ error: 'Only owners and facilitators can invite members.' })
  })

  it('returns error for empty email', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)
    const result = await inviteMemberAction('t1', '  ')
    expect(result).toEqual({ error: 'Email is required.' })
  })

  it('returns error when user not found', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await inviteMemberAction('t1', 'nobody@x.com')
    expect(result).toEqual({ error: 'No user found with that email.' })
  })

  it('returns error when user already a member', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)

    // First select: find user
    const selectUser = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'u2' }]),
    }
    // Second select: check existing membership
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'tm1' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectUser as any).mockReturnValueOnce(selectMember as any)

    const result = await inviteMemberAction('t1', 'existing@x.com')
    expect(result).toEqual({ error: 'User is already a team member.' })
  })

  it('invites member successfully', async () => {
    vi.mocked(requireTeamMember).mockResolvedValue({ userId: 'u1', role: 'owner' } as any)

    const selectUser = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'u2' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectUser as any).mockReturnValueOnce(selectMember as any)

    const insertChain = { values: vi.fn().mockResolvedValue(undefined) }
    vi.mocked(db.insert).mockReturnValue(insertChain as any)

    const result = await inviteMemberAction('t1', 'new@x.com')
    expect(result).toEqual({ success: true })
    expect(db.insert).toHaveBeenCalled()
  })
})
