import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TruthTable from './TruthTable.jsx'

const AND_ROWS = [
  { in: [0, 0], out: 0 },
  { in: [0, 1], out: 0 },
  { in: [1, 0], out: 0 },
  { in: [1, 1], out: 1 },
]

describe('TruthTable', () => {
  it('renders every row plus a header', () => {
    render(<TruthTable inputs={['A', 'B']} outputLabel="A·B" rows={AND_ROWS} active={[0, 0]} />)
    // 4 data rows
    expect(screen.getAllByTestId('truth-row')).toHaveLength(4)
  })

  it('marks exactly the row matching the active inputs', () => {
    render(<TruthTable inputs={['A', 'B']} outputLabel="A·B" rows={AND_ROWS} active={[1, 1]} />)
    const rows = screen.getAllByTestId('truth-row')
    const activeRows = rows.filter((r) => r.getAttribute('data-active') === 'true')
    expect(activeRows).toHaveLength(1)
    expect(activeRows[0]).toHaveTextContent('1')
  })

  it('shows the input and output column labels', () => {
    render(<TruthTable inputs={['A', 'B']} outputLabel="A·B" rows={AND_ROWS} active={[0, 0]} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('A·B')).toBeInTheDocument()
  })
})
