import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardItem } from '../card-item'

const baseCard = {
  id: 'c1',
  text: 'Great teamwork this sprint',
  author_id: 'u1',
  group_label: null,
  is_discussed: false,
  carried_from_retro_id: null,
}

describe('CardItem', () => {
  it('renders card text', () => {
    render(<CardItem card={baseCard} />)
    expect(screen.getByText('Great teamwork this sprint')).toBeInTheDocument()
  })

  it('shows "Hidden card" when showContent is false', () => {
    render(<CardItem card={baseCard} showContent={false} />)
    expect(screen.getByText('Hidden card')).toBeInTheDocument()
    expect(screen.queryByText('Great teamwork this sprint')).not.toBeInTheDocument()
  })

  it('shows group label badge', () => {
    render(<CardItem card={{ ...baseCard, group_label: 'Team Wins' }} />)
    expect(screen.getByText('Team Wins')).toBeInTheDocument()
  })

  it('shows tags', () => {
    render(<CardItem card={baseCard} tags={['frontend', 'ux']} />)
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('ux')).toBeInTheDocument()
  })

  it('shows "carried over" indicator', () => {
    render(<CardItem card={{ ...baseCard, carried_from_retro_id: 'r-prev' }} />)
    expect(screen.getByText('carried over')).toBeInTheDocument()
  })

  it('shows vote button with count when showVoting', () => {
    render(<CardItem card={baseCard} showVoting voteCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onVote when vote button clicked', async () => {
    const onVote = vi.fn()
    const user = userEvent.setup()
    render(<CardItem card={baseCard} showVoting voteCount={2} onVote={onVote} />)
    await user.click(screen.getByText('2'))
    expect(onVote).toHaveBeenCalledOnce()
  })

  it('shows delete button for own cards', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<CardItem card={baseCard} isOwn onDelete={onDelete} />)
    const deleteBtn = screen.getAllByRole('button').find((b) =>
      b.querySelector('.lucide-trash-2')
    )
    expect(deleteBtn).toBeDefined()
    if (deleteBtn) {
      await user.click(deleteBtn)
      expect(onDelete).toHaveBeenCalledOnce()
    }
  })

  it('does not show delete for non-own cards', () => {
    render(<CardItem card={baseCard} isOwn={false} onDelete={vi.fn()} />)
    const trashIcon = document.querySelector('.lucide-trash-2')
    expect(trashIcon).toBeNull()
  })

  it('shows discussed toggle button', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<CardItem card={baseCard} showDiscussed onToggleDiscussed={onToggle} />)
    const buttons = screen.getAllByRole('button')
    // The discussed toggle is the check button
    const checkBtn = buttons.find((b) => b.querySelector('.lucide-check'))
    expect(checkBtn).toBeDefined()
    if (checkBtn) {
      await user.click(checkBtn)
      expect(onToggle).toHaveBeenCalledOnce()
    }
  })

  it('applies opacity when discussed', () => {
    const { container } = render(<CardItem card={{ ...baseCard, is_discussed: true }} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('opacity-60')
  })
})
