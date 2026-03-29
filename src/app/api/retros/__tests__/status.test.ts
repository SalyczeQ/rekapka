import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}))

import { GET } from '../[id]/status/route'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('GET /api/retros/[id]/status', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)
    const res = await GET(new Request('http://localhost'), makeParams('r1'))
    expect(res.status).toBe(401)
  })

  it('returns 404 when retro not found', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const res = await GET(new Request('http://localhost'), makeParams('bad'))
    expect(res.status).toBe(404)
  })

  it('returns 403 when not a team member', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    // First select: retro found
    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ status: 'writing', teamId: 't1' }]),
    }
    // Second select: no membership
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    const res = await GET(new Request('http://localhost'), makeParams('r1'))
    expect(res.status).toBe(403)
  })

  it('returns status on success', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ status: 'voting', teamId: 't1' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'tm1' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    const res = await GET(new Request('http://localhost'), makeParams('r1'))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ status: 'voting' })
  })
})
