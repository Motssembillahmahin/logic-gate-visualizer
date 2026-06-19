import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BitToggle from './BitToggle.jsx'

describe('BitToggle', () => {
  it('renders the current bit value', () => {
    render(<BitToggle value={1} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('1')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<BitToggle value={0} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('does not call onToggle when disabled', () => {
    const onToggle = vi.fn()
    render(<BitToggle value={0} onToggle={onToggle} disabled />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('exposes pressed state for a value of 1', () => {
    render(<BitToggle value={1} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})
