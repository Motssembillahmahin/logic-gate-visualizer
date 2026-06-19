import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ALUPage from './ALUPage.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <ALUPage />
    </MemoryRouter>,
  )

const step = () => fireEvent.click(screen.getByRole('button', { name: /^step/i }))

describe('ALUPage — layout', () => {
  it('lays out four columns with bit 0 on the right', () => {
    renderPage()
    const cols = screen.getAllByTestId('adder-column')
    expect(cols).toHaveLength(4)
    expect(cols[0]).toHaveAttribute('data-bit', '3') // leftmost = MSB
    expect(cols[3]).toHaveAttribute('data-bit', '0') // rightmost = LSB
  })

  it('shows 5 + 3 = 1000 (8) with no overflow', () => {
    renderPage()
    expect(screen.getByTestId('result-binary')).toHaveTextContent('1000')
    expect(screen.getByTestId('result-decimal')).toHaveTextContent('8')
    expect(screen.queryByTestId('overflow-badge')).not.toBeInTheDocument()
  })
})

describe('ALUPage — step mode', () => {
  it('starts with no column active', () => {
    renderPage()
    const active = screen.getAllByTestId('adder-column').filter((c) => c.getAttribute('data-active') === 'true')
    expect(active).toHaveLength(0)
  })

  it('lights bit 0 (rightmost) first when stepping', () => {
    renderPage()
    step()
    const cols = screen.getAllByTestId('adder-column')
    expect(cols[3]).toHaveAttribute('data-active', 'true') // bit 0
    expect(cols[0]).toHaveAttribute('data-active', 'false')
  })

  it('advances the active column left as carry travels', () => {
    renderPage()
    step()
    step()
    const cols = screen.getAllByTestId('adder-column')
    expect(cols[2]).toHaveAttribute('data-active', 'true') // bit 1
  })
})

describe('ALUPage — proceed gating', () => {
  it('disables Next until a full run is completed', () => {
    renderPage()
    expect(screen.queryByRole('link', { name: /cpu/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cpu/i })).toBeDisabled()
  })

  it('enables Next after stepping through all four columns', () => {
    renderPage()
    step()
    step()
    step()
    step()
    expect(screen.getByRole('link', { name: /cpu/i }).getAttribute('href')).toContain('/cpu')
  })
})

describe('ALUPage — auto mode', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Run advances every column on a timer and completes the run', () => {
    vi.useFakeTimers()
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /run/i }))
    // advance tick-by-tick so each timer-driven state update flushes
    for (let i = 0; i < 4; i++) {
      act(() => {
        vi.advanceTimersByTime(500)
      })
    }
    const cols = screen.getAllByTestId('adder-column')
    expect(cols[0]).toHaveAttribute('data-active', 'true') // MSB now active
    expect(screen.getByRole('link', { name: /cpu/i }).getAttribute('href')).toContain('/cpu')
  })
})
