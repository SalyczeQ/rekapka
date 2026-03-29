import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionItemCard } from '../action-item-card'

const baseAction = {
  id: 'a1',
  text: 'Fix CI pipeline',
  status: 'open' as const,
  due_date: null,
  assignee: null,
}

describe('ActionItemCard', () => {
  it('renders action text', () => {
    render(<ActionItemCard action={baseAction} />)
    expect(screen.getByText('Fix CI pipeline')).toBeInTheDocument()
  })

  it('shows Open status badge', () => {
    render(<ActionItemCard action={baseAction} />)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('shows In Progress status badge', () => {
    render(<ActionItemCard action={{ ...baseAction, status: 'in_progress' }} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('shows Done status badge with line-through', () => {
    const { container } = render(
      <ActionItemCard action={{ ...baseAction, status: 'done' }} />
    )
    expect(screen.getByText('Done')).toBeInTheDocument()
    const textEl = container.querySelector('.line-through')
    expect(textEl).toBeTruthy()
  })

  it('cycles status on click: open -> in_progress', async () => {
    const onStatusChange = vi.fn()
    const user = userEvent.setup()
    render(<ActionItemCard action={baseAction} onStatusChange={onStatusChange} />)

    await user.click(screen.getByText('Open'))
    expect(onStatusChange).toHaveBeenCalledWith('in_progress')
  })

  it('cycles status: in_progress -> done', async () => {
    const onStatusChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ActionItemCard
        action={{ ...baseAction, status: 'in_progress' }}
        onStatusChange={onStatusChange}
      />
    )

    await user.click(screen.getByText('In Progress'))
    expect(onStatusChange).toHaveBeenCalledWith('done')
  })

  it('cycles status: done -> open', async () => {
    const onStatusChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ActionItemCard
        action={{ ...baseAction, status: 'done' }}
        onStatusChange={onStatusChange}
      />
    )

    await user.click(screen.getByText('Done'))
    expect(onStatusChange).toHaveBeenCalledWith('open')
  })

  it('shows assignee info', () => {
    render(
      <ActionItemCard
        action={{ ...baseAction, assignee: { name: 'Alice', avatar_url: null } }}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument() // fallback initial
  })

  it('shows due date', () => {
    render(
      <ActionItemCard action={{ ...baseAction, due_date: '2026-04-15' }} />
    )
    // The date format depends on locale, just check something renders
    const dateText = screen.getByText(/4\/15\/2026|15\/04\/2026|2026/)
    expect(dateText).toBeInTheDocument()
  })

  it('applies opacity for done status', () => {
    const { container } = render(
      <ActionItemCard action={{ ...baseAction, status: 'done' }} />
    )
    // The Card component wrapping should have opacity-60
    const cardEl = container.firstChild as HTMLElement
    expect(cardEl.className).toContain('opacity-60')
  })
})
