import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdderPage from './AdderPage.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdderPage />
    </MemoryRouter>,
  )

describe('AdderPage — half adder (A=1, B=1 from 5+3 bit 0)', () => {
  it('sums to 0 with a carry of 1', () => {
    renderPage()
    expect(screen.getByTestId('ha-sum')).toHaveTextContent('0')
    expect(screen.getByTestId('ha-carry')).toHaveTextContent('1')
  })
})

describe('AdderPage — full adder', () => {
  it('with carry_in 0 (default) gives sum 0, carry_out 1', () => {
    renderPage()
    expect(screen.getByTestId('fa-sum')).toHaveTextContent('0')
    expect(screen.getByTestId('fa-carry-out')).toHaveTextContent('1')
  })

  it('toggling carry_in to 1 makes the sum 1', () => {
    renderPage()
    fireEvent.click(within(screen.getByTestId('carry-in-toggle')).getByRole('button'))
    expect(screen.getByTestId('fa-sum')).toHaveTextContent('1')
    expect(screen.getByTestId('fa-carry-out')).toHaveTextContent('1')
  })

  it('explains that carry_out moves to the next column', () => {
    renderPage()
    expect(screen.getByText(/carry_out moves to the next column/i)).toBeInTheDocument()
  })
})

describe('AdderPage navigation', () => {
  it('goes onward to the ALU page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /ALU/i }).getAttribute('href')).toContain('/alu')
  })
})
