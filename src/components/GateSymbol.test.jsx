import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GateSymbol from './GateSymbol.jsx'

describe('GateSymbol', () => {
  it('labels the gate by type', () => {
    render(<GateSymbol type="XOR" active={false} />)
    expect(screen.getByTestId('gate-symbol')).toHaveAttribute('data-type', 'XOR')
    expect(screen.getByText('XOR')).toBeInTheDocument()
  })

  it('reflects activation state', () => {
    render(<GateSymbol type="AND" active />)
    expect(screen.getByTestId('gate-symbol')).toHaveAttribute('data-active', 'true')
  })

  it('is inactive when active is false', () => {
    render(<GateSymbol type="OR" active={false} />)
    expect(screen.getByTestId('gate-symbol')).toHaveAttribute('data-active', 'false')
  })

  it('renders each of the four gate types', () => {
    for (const type of ['AND', 'OR', 'XOR', 'NOT']) {
      const { unmount } = render(<GateSymbol type={type} active={false} />)
      expect(screen.getByText(type)).toBeInTheDocument()
      unmount()
    }
  })
})
