import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdderColumn from './AdderColumn.jsx'

// Shape comes straight from alu().columns[i].
const column = { bit: 0, a: 1, b: 1, carryIn: 0, sum: 0, carryOut: 1 }

describe('AdderColumn', () => {
  it('tags itself with its bit position', () => {
    render(<AdderColumn column={column} />)
    expect(screen.getByTestId('adder-column')).toHaveAttribute('data-bit', '0')
  })

  it('renders every signal value from the column object', () => {
    render(<AdderColumn column={column} />)
    expect(screen.getByTestId('col-a')).toHaveTextContent('1')
    expect(screen.getByTestId('col-b')).toHaveTextContent('1')
    expect(screen.getByTestId('col-carry-in')).toHaveTextContent('0')
    expect(screen.getByTestId('col-sum')).toHaveTextContent('0')
    expect(screen.getByTestId('col-carry-out')).toHaveTextContent('1')
  })

  it('reflects the active (currently-computing) state', () => {
    render(<AdderColumn column={column} active />)
    expect(screen.getByTestId('adder-column')).toHaveAttribute('data-active', 'true')
  })
})
