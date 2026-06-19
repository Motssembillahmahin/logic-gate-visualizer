import { describe, it, expect } from 'vitest'
import { halfAdder } from './halfAdder.js'

describe('halfAdder', () => {
  it('sum is XOR, carry is AND, across the full truth table', () => {
    expect(halfAdder(0, 0)).toEqual({ sum: 0, carry: 0 })
    expect(halfAdder(0, 1)).toEqual({ sum: 1, carry: 0 })
    expect(halfAdder(1, 0)).toEqual({ sum: 1, carry: 0 })
    expect(halfAdder(1, 1)).toEqual({ sum: 0, carry: 1 })
  })
})
