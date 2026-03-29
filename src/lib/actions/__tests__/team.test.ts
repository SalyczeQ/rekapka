import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { createTeamAction } from '../team'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(data)) fd.append(k, v)
  return fd
}

describe('createTeamAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)
    const result = await createTeamAction(makeFormData({ name: 'Team', slug: 'team' }))
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('returns error for missing name', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const result = await createTeamAction(makeFormData({ name: '', slug: 'team' }))
    expect(result).toEqual({ error: 'Team name and slug are required.' })
  })

  it('returns error for missing slug', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const result = await createTeamAction(makeFormData({ name: 'Team', slug: '' }))
    expect(result).toEqual({ error: 'Team name and slug are required.' })
  })

  it('returns error if slug already taken', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'existing' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await createTeamAction(makeFormData({ name: 'Team', slug: 'taken' }))
    expect(result).toEqual({ error: 'This slug is already taken.' })
  })

  it('creates team and redirects on success', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    // First select: slug check (not found)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    // Insert team
    const insertReturning = { returning: vi.fn().mockResolvedValue([{ id: 't1', slug: 'new-team' }]) }
    const insertValues = { values: vi.fn().mockReturnValue(insertReturning) }
    vi.mocked(db.insert).mockReturnValueOnce(insertValues as any)

    // Insert team member
    const insertMember = { values: vi.fn().mockResolvedValue(undefined) }
    vi.mocked(db.insert).mockReturnValueOnce(insertMember as any)

    await createTeamAction(makeFormData({ name: 'New Team', slug: 'new-team' }))

    expect(db.insert).toHaveBeenCalledTimes(2)
    expect(redirect).toHaveBeenCalledWith('/app/new-team')
  })
})
