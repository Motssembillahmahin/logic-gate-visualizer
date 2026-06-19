import { describe, it, expect } from 'vitest'
import { fullAdder } from './fullAdder.js'

describe('fullAdder', () => {
  it('covers the full 3-input truth table (a, b, carryIn)', () => {
    expect(fullAdder(0, 0, 0)).toEqual({ sum: 0, carryOut: 0 })
    expect(fullAdder(0, 0, 1)).toEqual({ sum: 1, carryOut: 0 })
    expect(fullAdder(0, 1, 0)).toEqual({ sum: 1, carryOut: 0 })
    expect(fullAdder(0, 1, 1)).toEqual({ sum: 0, carryOut: 1 })
    expect(fullAdder(1, 0, 0)).toEqual({ sum: 1, carryOut: 0 })
    expect(fullAdder(1, 0, 1)).toEqual({ sum: 0, carryOut: 1 })
    expect(fullAdder(1, 1, 0)).toEqual({ sum: 0, carryOut: 1 })
    expect(fullAdder(1, 1, 1)).toEqual({ sum: 1, carryOut: 1 })
  })

  it('matches the CLAUDE.md edge case: carryIn=1, a=0, b=0 -> sum 1, carryOut 0', () => {
    expect(fullAdder(0, 0, 1)).toEqual({ sum: 1, carryOut: 0 })
  })
})
