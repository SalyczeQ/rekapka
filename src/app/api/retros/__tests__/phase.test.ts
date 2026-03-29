import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}))

import { PATCH } from '../[id]/phase/route'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/retros/r1/phase', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) }
}

describe('PATCH /api/retros/[id]/phase', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as any)
    const res = await PATCH(makeRequest({ target_status: 'writing' }), makeParams('r1'))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid target_status', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const res = await PATCH(makeRequest({ target_status: 'invalid' }), makeParams('r1'))
    expect(res.status).toBe(400)
  })

  it('returns 404 when retro not found', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const res = await PATCH(makeRequest({ target_status: 'writing' }), makeParams('r1'))
    expect(res.status).toBe(404)
  })

  it('returns 403 when member cannot advance phase', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u-other' } } as any)

    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'r1', teamId: 't1', status: 'draft', createdBy: 'u-creator' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ role: 'member' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    const res = await PATCH(makeRequest({ target_status: 'writing' }), makeParams('r1'))
    expect(res.status).toBe(403)
  })

  it('returns 409 for invalid phase transition', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'r1', teamId: 't1', status: 'draft', createdBy: 'u1' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ role: 'owner' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    // Try to skip from draft to voting
    const res = await PATCH(makeRequest({ target_status: 'voting' }), makeParams('r1'))
    expect(res.status).toBe(409)
  })

  it('returns 409 when trying to advance to completed', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'r1', teamId: 't1', status: 'actions', createdBy: 'u1' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ role: 'owner' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    const res = await PATCH(makeRequest({ target_status: 'completed' }), makeParams('r1'))
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toContain('/complete endpoint')
  })

  it('advances phase successfully', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'u1' } } as any)

    const selectRetro = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 'r1', teamId: 't1', status: 'draft', createdBy: 'u1' }]),
    }
    const selectMember = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ role: 'owner' }]),
    }
    vi.mocked(db.select).mockReturnValueOnce(selectRetro as any).mockReturnValueOnce(selectMember as any)

    const updatedRetro = { id: 'r1', status: 'writing' }
    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([updatedRetro]),
    }
    vi.mocked(db.update).mockReturnValue(updateChain as any)

    const res = await PATCH(makeRequest({ target_status: 'writing' }), makeParams('r1'))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.retro.status).toBe('writing')
  })
})
