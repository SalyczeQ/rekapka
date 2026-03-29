import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRetroPhase } from '../use-retro-phase'

describe('useRetroPhase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('initializes with default phase', () => {
    const { result } = renderHook(() => useRetroPhase('r1'))
    expect(result.current.phase).toBe('write')
  })

  it('initializes with custom phase', () => {
    const { result } = renderHook(() => useRetroPhase('r1', 'vote'))
    expect(result.current.phase).toBe('vote')
  })

  it('advances phase locally', async () => {
    const { result } = renderHook(() => useRetroPhase('r1', 'write'))

    await act(async () => {
      await result.current.advancePhase()
    })

    expect(result.current.phase).toBe('vote')
  })

  it('does not advance past complete', async () => {
    const { result } = renderHook(() => useRetroPhase('r1', 'complete'))

    await act(async () => {
      await result.current.advancePhase()
    })

    expect(result.current.phase).toBe('complete')
  })

  it('polls for phase changes', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'discuss' }),
    } as Response)

    renderHook(() => useRetroPhase('r1', 'write'))

    // Advance past the 3 second poll interval
    await act(async () => {
      vi.advanceTimersByTime(3500)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/retros/r1/status')
  })
})
