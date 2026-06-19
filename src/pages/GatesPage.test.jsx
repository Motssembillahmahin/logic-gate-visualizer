import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GatesPage from './GatesPage.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <GatesPage />
    </MemoryRouter>,
  )

// Default inputs A=1, B=0 → AND 0, OR 1, XOR 1, NOT(A) 0.
describe('GatesPage', () => {
  it('computes every gate output from the default inputs', () => {
    renderPage()
    expect(screen.getByTestId('output-AND')).toHaveTextContent('0')
    expect(screen.getByTestId('output-OR')).toHaveTextContent('1')
    expect(screen.getByTestId('output-XOR')).toHaveTextContent('1')
    expect(screen.getByTestId('output-NOT')).toHaveTextContent('0')
  })

  it('recomputes when an input is toggled', () => {
    renderPage()
    // toggle B from 0 to 1 → AND becomes 1, XOR becomes 0
    fireEvent.click(within(screen.getByTestId('input-B')).getByRole('button'))
    expect(screen.getByTestId('output-AND')).toHaveTextContent('1')
    expect(screen.getByTestId('output-XOR')).toHaveTextContent('0')
  })

  it('renders all four gate symbols', () => {
    renderPage()
    for (const type of ['AND', 'OR', 'XOR', 'NOT']) {
      expect(screen.getByTestId('gate-card-' + type)).toBeInTheDocument()
    }
  })

  it('navigates onward to the adder page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /adder/i }).getAttribute('href')).toContain('/adder')
  })
})
