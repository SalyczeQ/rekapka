import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../use-timer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default seconds', () => {
    const { result } = renderHook(() => useTimer('r1', 300))
    expect(result.current.remaining).toBe(300)
    expect(result.current.isRunning).toBe(false)
  })

  it('starts counting down', () => {
    const { result } = renderHook(() => useTimer('r1', 60))

    act(() => {
      result.current.start()
    })

    expect(result.current.isRunning).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.remaining).toBe(57)
  })

  it('pauses the timer', () => {
    const { result } = renderHook(() => useTimer('r1', 60))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      result.current.pause()
    })

    expect(result.current.isRunning).toBe(false)
    const paused = result.current.remaining

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.remaining).toBe(paused)
  })

  it('resets the timer', () => {
    const { result } = renderHook(() => useTimer('r1', 120))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.remaining).toBe(120)
    expect(result.current.isRunning).toBe(false)
  })

  it('stops at zero', () => {
    const { result } = renderHook(() => useTimer('r1', 2))

    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.remaining).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('starts with custom seconds', () => {
    const { result } = renderHook(() => useTimer('r1', 300))

    act(() => {
      result.current.start(10)
    })

    expect(result.current.remaining).toBe(10)
    expect(result.current.isRunning).toBe(true)
  })
})
