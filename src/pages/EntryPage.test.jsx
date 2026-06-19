import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EntryProvider, useEntry } from '../context/EntryContext.jsx'
import EntryPage from './EntryPage.jsx'

function EntryProbe() {
  const { entryPoint } = useEntry()
  return <div>entry: {entryPoint ?? 'none'}</div>
}

function renderApp() {
  return render(
    <EntryProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/numbers" element={<EntryProbe />} />
        </Routes>
      </MemoryRouter>
    </EntryProvider>,
  )
}

describe('EntryPage', () => {
  it('offers both the calculator and the PostgreSQL entry points', () => {
    renderApp()
    expect(screen.getByText('5 + 3 = ?')).toBeInTheDocument()
    expect(screen.getByText(/SELECT 5 \+ 3/i)).toBeInTheDocument()
  })

  it('choosing the calculator stores that choice and routes to /numbers', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /calculator/i }))
    expect(screen.getByText('entry: calculator')).toBeInTheDocument()
  })

  it('choosing PostgreSQL stores that choice and routes to /numbers', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /postgresql/i }))
    expect(screen.getByText('entry: postgresql')).toBeInTheDocument()
  })

  it('has no back/previous navigation', () => {
    renderApp()
    expect(screen.queryByText(/Previous/i)).not.toBeInTheDocument()
  })
})
