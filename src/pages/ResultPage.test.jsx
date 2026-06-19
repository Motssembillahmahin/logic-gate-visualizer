import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EntryContext from '../context/EntryContext.jsx'
import ResultPage from './ResultPage.jsx'

const renderWith = (entryPoint) =>
  render(
    <EntryContext.Provider value={{ entryPoint, setEntryPoint: () => {} }}>
      <MemoryRouter>
        <ResultPage />
      </MemoryRouter>
    </EntryContext.Provider>,
  )

describe('ResultPage — calculator ending', () => {
  it('shows the calculator display lighting up 8', () => {
    renderWith('calculator')
    expect(screen.getByTestId('result-calculator')).toBeInTheDocument()
    expect(screen.getByTestId('result-calculator')).toHaveTextContent('8')
  })

  it('captions what happened when you pressed =', () => {
    renderWith('calculator')
    expect(screen.getByText(/when you pressed =/i)).toBeInTheDocument()
  })
})

describe('ResultPage — PostgreSQL ending', () => {
  it('shows the psql output with column header and 8', () => {
    renderWith('postgresql')
    const term = screen.getByTestId('result-postgresql')
    expect(term).toHaveTextContent('?column?')
    expect(term).toHaveTextContent('8')
  })

  it('captions what happened when PostgreSQL ran the query', () => {
    renderWith('postgresql')
    expect(screen.getByText(/when PostgreSQL ran your query/i)).toBeInTheDocument()
  })
})

describe('ResultPage — no entry point chosen (deep link / refresh)', () => {
  it('falls back gracefully without crashing and offers a way to start', () => {
    renderWith(null)
    expect(screen.getByTestId('result-fallback')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start/i }).getAttribute('href')).toContain('/')
  })
})

describe('ResultPage — shared summary', () => {
  it('shows the full layer-stack summary for a chosen path', () => {
    renderWith('calculator')
    expect(screen.getByTestId('layer-summary')).toBeInTheDocument()
  })
})
