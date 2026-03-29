import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before imports
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}))

vi.mock('@/lib/auth', () => ({
  signIn: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed_pw') },
}))

vi.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: vi.fn().mockReturnValue(false),
}))

import { signUpAction, signInAction } from '../auth'
import { db } from '@/lib/db'
import { signIn } from '@/lib/auth'

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(data)) fd.append(k, v)
  return fd
}

describe('signUpAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error for missing name', async () => {
    const result = await signUpAction(null, makeFormData({ name: '', email: 'a@b.com', password: '123456' }))
    expect(result).toEqual({ error: 'Name, email, and password (min 6 chars) are required.' })
  })

  it('returns error for short password', async () => {
    const result = await signUpAction(null, makeFormData({ name: 'Test', email: 'a@b.com', password: '123' }))
    expect(result).toEqual({ error: 'Name, email, and password (min 6 chars) are required.' })
  })

  it('returns error if user already exists', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: '123' }]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const result = await signUpAction(null, makeFormData({ name: 'Test', email: 'a@b.com', password: '123456' }))
    expect(result).toEqual({ error: 'An account with this email already exists.' })
  })

  it('creates user and signs in when valid', async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    }
    vi.mocked(db.select).mockReturnValue(selectChain as any)

    const insertChain = { values: vi.fn().mockResolvedValue(undefined) }
    vi.mocked(db.insert).mockReturnValue(insertChain as any)
    vi.mocked(signIn).mockResolvedValue(undefined as any)

    await signUpAction(null, makeFormData({ name: 'Test', email: 'A@B.COM', password: '123456' }))

    expect(db.insert).toHaveBeenCalled()
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'a@b.com',
      password: '123456',
      redirectTo: '/app',
    })
  })
})

describe('signInAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error for missing email', async () => {
    const result = await signInAction(null, makeFormData({ email: '', password: '123456' }))
    expect(result).toEqual({ error: 'Email and password are required.' })
  })

  it('returns error for missing password', async () => {
    const result = await signInAction(null, makeFormData({ email: 'a@b.com', password: '' }))
    expect(result).toEqual({ error: 'Email and password are required.' })
  })

  it('returns error on failed sign in', async () => {
    vi.mocked(signIn).mockRejectedValue(new Error('Invalid'))

    const result = await signInAction(null, makeFormData({ email: 'a@b.com', password: 'wrong' }))
    expect(result).toEqual({ error: 'Invalid email or password.' })
  })
})
