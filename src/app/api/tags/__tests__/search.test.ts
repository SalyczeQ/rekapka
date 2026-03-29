import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}))

import { GET } from '../search/route'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

describe('GET /api/tags/search', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)
    const req = new NextRequest('http://localhost/api/tags/search?teamId=t1&q=bug')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns empty tags when teamId or q missing', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const req = new NextRequest('http://localhost/api/tags/search')
    const res = await GET(req)
    const body = await res.json()
    expect(body).toEqual({ tags: [] })
  })

  it('returns 403 when not a team member', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectMember as any)

    const req = new NextRequest('http://localhost/api/tags/search?teamId=t1&q=bug')
    const res = await GET(req)
    expect(res.status).toBe(403)
  })

  it('returns matching tags', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    // First select: membership check
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'tm1' }]),
    }
    // Second select: tag search
    const selectTags = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'tag1', name: 'bug', usageCount: 5 }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectMember as any).mockReturnValueOnce(selectTags as any)

    const req = new NextRequest('http://localhost/api/tags/search?teamId=t1&q=bug')
    const res = await GET(req)
    const body = await res.json()
    expect(body.tags).toEqual([{ id: 'tag1', name: 'bug', usage_count: 5 }])
  })
})
