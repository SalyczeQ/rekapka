import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn(),
  },
}))

// Must re-mock drizzle-orm since the route imports sql from it
vi.mock('drizzle-orm', () => ({
  sql: (strings: TemplateStringsArray) => strings.join(''),
}))

import { GET } from '../../health/route'
import { db } from '@/lib/db'

describe('GET /api/health', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns ok when db is connected', async () => {
    vi.mocked(db.execute).mockResolvedValue([] as any)
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ status: 'ok', db: 'connected' })
  })

  it('returns 503 when db is unreachable', async () => {
    vi.mocked(db.execute).mockRejectedValue(new Error('Connection failed'))
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(503)
    expect(body).toEqual({ status: 'error', db: 'unreachable' })
  })
})
