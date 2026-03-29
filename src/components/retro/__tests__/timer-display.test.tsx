import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerDisplay } from '../timer-display'

describe('TimerDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when no duration and not facilitator', () => {
    const { container } = render(
      <TimerDisplay retroId="r1" durationSeconds={null} isFacilitator={false} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('displays formatted time', () => {
    render(<TimerDisplay retroId="r1" durationSeconds={125} isFacilitator={false} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('shows controls for facilitator', () => {
    render(<TimerDisplay retroId="r1" durationSeconds={300} isFacilitator={true} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2) // play + reset
  })

  it('does not show controls for non-facilitator', () => {
    render(<TimerDisplay retroId="r1" durationSeconds={300} isFacilitator={false} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('counts down when started', () => {
    render(<TimerDisplay retroId="r1" durationSeconds={65} isFacilitator={true} />)

    expect(screen.getByText('01:05')).toBeInTheDocument()

    // Click play
    const buttons = screen.getAllByRole('button')
    act(() => {
      buttons[0].click()
    })

    // Advance 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText('01:03')).toBeInTheDocument()
  })

  it('resets timer', () => {
    render(<TimerDisplay retroId="r1" durationSeconds={120} isFacilitator={true} />)

    // Click play
    const buttons = screen.getAllByRole('button')
    act(() => {
      buttons[0].click()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('01:55')).toBeInTheDocument()

    // Click reset
    act(() => {
      buttons[1].click()
    })
    expect(screen.getByText('02:00')).toBeInTheDocument()
  })
})
