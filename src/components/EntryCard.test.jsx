import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EntryCard from './EntryCard.jsx'

describe('EntryCard', () => {
  it('renders its title and description', () => {
    render(
      <EntryCard
        title="Calculator"
        description="5 + 3 = ?"
        onSelect={() => {}}
      />,
    )
    expect(screen.getByText('Calculator')).toBeInTheDocument()
    expect(screen.getByText('5 + 3 = ?')).toBeInTheDocument()
  })

  it('calls onSelect when the card is activated', () => {
    const onSelect = vi.fn()
    render(<EntryCard title="PostgreSQL" description="SELECT 5 + 3;" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /PostgreSQL/i }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
