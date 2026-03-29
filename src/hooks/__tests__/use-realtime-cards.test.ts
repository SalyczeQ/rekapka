import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRealtimeCards } from '../use-realtime-cards'

describe('useRealtimeCards', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('starts with empty cards', () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
    } as Response)

    const { result } = renderHook(() => useRealtimeCards('r1'))
    expect(result.current).toEqual([])
  })

  it('fetches cards on mount', async () => {
    const mockCards = [{ id: 'c1', text: 'Hello' }]
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ cards: mockCards }),
    } as Response)

    const { result } = renderHook(() => useRealtimeCards('r1'))

    // Initial setTimeout(fetchCards, 0)
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/retros/r1/cards')
    expect(result.current).toEqual(mockCards)
  })

  it('polls every 3 seconds', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ cards: [] }),
    } as Response)

    renderHook(() => useRealtimeCards('r1'))

    await act(async () => {
      vi.advanceTimersByTime(0) // initial
    })

    await act(async () => {
      vi.advanceTimersByTime(3000) // first poll
    })

    await act(async () => {
      vi.advanceTimersByTime(3000) // second poll
    })

    // initial + 2 polls = 3 calls
    expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThanOrEqual(3)
  })

  it('handles fetch errors silently', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useRealtimeCards('r1'))

    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    // Should not throw, cards remain empty
    expect(result.current).toEqual([])
  })
})
