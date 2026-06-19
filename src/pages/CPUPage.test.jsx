import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CPUPage from './CPUPage.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <CPUPage />
    </MemoryRouter>,
  )

const card = (name) => screen.getByRole('button', { name: new RegExp(name, 'i') })

describe('CPUPage — the four-stage cycle', () => {
  it('shows all four CPU stages', () => {
    renderPage()
    for (const stage of ['Fetch', 'Decode', 'Execute', 'Writeback']) {
      expect(card(stage)).toBeInTheDocument()
    }
  })

  it('locks every stage except the first at the start', () => {
    renderPage()
    const layers = screen.getAllByTestId('cpu-layer')
    expect(layers[0]).toHaveAttribute('data-locked', 'false')
    expect(layers[1]).toHaveAttribute('data-locked', 'true')
    expect(layers[2]).toHaveAttribute('data-locked', 'true')
    expect(layers[3]).toHaveAttribute('data-locked', 'true')
  })

  it('opening Fetch unlocks Decode', () => {
    renderPage()
    fireEvent.click(card('Fetch'))
    const layers = screen.getAllByTestId('cpu-layer')
    expect(layers[0]).toHaveAttribute('data-open', 'true')
    expect(layers[1]).toHaveAttribute('data-locked', 'false')
  })

  it('embeds an inline read-only ALU inside Execute (four columns)', () => {
    renderPage()
    fireEvent.click(card('Fetch'))
    fireEvent.click(card('Decode'))
    fireEvent.click(card('Execute'))
    expect(screen.getAllByTestId('adder-column')).toHaveLength(4)
  })
})

describe('CPUPage — proceed gating', () => {
  it('disables Next until all four stages have been opened', () => {
    renderPage()
    expect(screen.queryByRole('link', { name: /result/i })).not.toBeInTheDocument()
    fireEvent.click(card('Fetch'))
    fireEvent.click(card('Decode'))
    fireEvent.click(card('Execute'))
    fireEvent.click(card('Writeback'))
    expect(screen.getByRole('link', { name: /result/i }).getAttribute('href')).toContain('/result')
  })
})
