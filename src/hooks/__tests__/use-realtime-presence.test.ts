import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRealtimePresence } from '../use-realtime-presence'

describe('useRealtimePresence', () => {
  it('returns the current user as online', () => {
    const { result } = renderHook(() =>
      useRealtimePresence('r1', { id: 'u1', name: 'Alice' })
    )
    expect(result.current).toEqual([{ userId: 'u1', name: 'Alice' }])
  })

  it('returns array with single user', () => {
    const { result } = renderHook(() =>
      useRealtimePresence('r1', { id: 'u2', name: 'Bob' })
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].userId).toBe('u2')
  })
})
