import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NumbersPage from './NumbersPage.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <NumbersPage />
    </MemoryRouter>,
  )

describe('NumbersPage', () => {
  it('shows 5 converting to its 4-bit binary 0101', () => {
    renderPage()
    expect(screen.getByTestId('binary-5')).toHaveTextContent('0101')
  })

  it('shows 3 converting to its 4-bit binary 0011', () => {
    renderPage()
    expect(screen.getByTestId('binary-3')).toHaveTextContent('0011')
  })

  it('renders four bit cells for each number', () => {
    renderPage()
    expect(screen.getByTestId('binary-5').querySelectorAll('[data-bit-cell]')).toHaveLength(4)
    expect(screen.getByTestId('binary-3').querySelectorAll('[data-bit-cell]')).toHaveLength(4)
  })

  it('offers a Next link onward to the gates page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /gates/i }).getAttribute('href')).toContain('/gates')
  })
})
