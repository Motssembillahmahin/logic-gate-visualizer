import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignalWire from './SignalWire.jsx'

describe('SignalWire', () => {
  it('reflects the bit value it carries', () => {
    render(<SignalWire value={1} />)
    expect(screen.getByTestId('signal-wire')).toHaveAttribute('data-value', '1')
  })

  it('reports whether the signal is energized (active)', () => {
    render(<SignalWire value={1} active />)
    expect(screen.getByTestId('signal-wire')).toHaveAttribute('data-active', 'true')
  })

  it('is not active by default', () => {
    render(<SignalWire value={0} />)
    expect(screen.getByTestId('signal-wire')).toHaveAttribute('data-active', 'false')
  })

  it('marks carry wires distinctly', () => {
    render(<SignalWire value={1} carry />)
    expect(screen.getByTestId('signal-wire')).toHaveAttribute('data-carry', 'true')
  })

  it('has an accessible label describing the signal', () => {
    render(<SignalWire value={0} />)
    expect(screen.getByLabelText(/signal carrying 0/i)).toBeInTheDocument()
  })
})
