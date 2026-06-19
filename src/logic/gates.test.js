import { describe, it, expect } from 'vitest'
import { and, or, xor, not } from './gates.js'

describe('and', () => {
  it('is 1 only when both inputs are 1', () => {
    expect(and(0, 0)).toBe(0)
    expect(and(0, 1)).toBe(0)
    expect(and(1, 0)).toBe(0)
    expect(and(1, 1)).toBe(1)
  })
})

describe('or', () => {
  it('is 1 when either input is 1', () => {
    expect(or(0, 0)).toBe(0)
    expect(or(0, 1)).toBe(1)
    expect(or(1, 0)).toBe(1)
    expect(or(1, 1)).toBe(1)
  })
})

describe('xor', () => {
  it('is 1 only when inputs differ', () => {
    expect(xor(0, 0)).toBe(0)
    expect(xor(0, 1)).toBe(1)
    expect(xor(1, 0)).toBe(1)
    expect(xor(1, 1)).toBe(0)
  })
})

describe('not', () => {
  it('inverts a single bit', () => {
    expect(not(0)).toBe(1)
    expect(not(1)).toBe(0)
  })
})
