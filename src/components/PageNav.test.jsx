import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PageNav from './PageNav.jsx'

const renderNav = (props) =>
  render(
    <MemoryRouter>
      <PageNav {...props} />
    </MemoryRouter>,
  )

describe('PageNav', () => {
  it('renders a Previous link pointing at the given path', () => {
    renderNav({ prev: { to: '/gates', label: 'Gates' } })
    const link = screen.getByRole('link', { name: /Gates/i })
    expect(link.getAttribute('href')).toContain('/gates')
  })

  it('omits Previous when there is no prev (e.g. EntryPage)', () => {
    renderNav({ next: { to: '/numbers', label: 'Numbers' } })
    expect(screen.queryByText(/Previous/i)).not.toBeInTheDocument()
  })

  it('renders a Next link pointing at the given path', () => {
    renderNav({ next: { to: '/numbers', label: 'Numbers' } })
    expect(screen.getByRole('link', { name: /Numbers/i }).getAttribute('href')).toContain('/numbers')
  })

  it('shows Next as disabled (not a link) when nextDisabled is set', () => {
    renderNav({ next: { to: '/alu', label: 'ALU' }, nextDisabled: true })
    expect(screen.queryByRole('link', { name: /ALU/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ALU/i })).toBeDisabled()
  })
})
