import { describe, it, expect } from 'vitest'
import { alu } from './alu.js'
import { decimalToBinary, binaryToDecimal } from './binary.js'

// alu(bitsA, bitsB) takes two MSB-first 4-bit arrays and ripple-adds them.
// It returns per-column state (LSB-first, so columns[0] is bit 0) plus the
// final sum, carry-out and overflow flag.

const run = (a, b) => alu(decimalToBinary(a), decimalToBinary(b))

describe('alu — headline case 5 + 3', () => {
  const r = run(5, 3)

  it('produces the 4-bit sum 8 with no overflow', () => {
    expect(binaryToDecimal(r.sumBits)).toBe(8)
    expect(r.sumBits).toEqual([1, 0, 0, 0])
    expect(r.decimal).toBe(8)
    expect(r.carryOut).toBe(0)
    expect(r.overflow).toBe(false)
  })

  it('exposes four columns, LSB-first, each tagged with its bit position', () => {
    expect(r.columns).toHaveLength(4)
    expect(r.columns.map((c) => c.bit)).toEqual([0, 1, 2, 3])
  })

  it('shows the carry physically travelling left, column by column', () => {
    expect(r.columns.map((c) => c.carryIn)).toEqual([0, 1, 1, 1])
    expect(r.columns.map((c) => c.carryOut)).toEqual([1, 1, 1, 0])
  })

  it("each column's carryOut feeds the next column's carryIn", () => {
    for (let i = 0; i < r.columns.length - 1; i++) {
      expect(r.columns[i + 1].carryIn).toBe(r.columns[i].carryOut)
    }
  })
})

describe('alu — edge cases from CLAUDE.md', () => {
  it('0 + 0: all zeros, no carry anywhere', () => {
    const r = run(0, 0)
    expect(r.decimal).toBe(0)
    expect(r.overflow).toBe(false)
    expect(r.columns.every((c) => c.carryIn === 0 && c.carryOut === 0)).toBe(true)
  })

  it('15 + 1: carry exits bit 3 (result 10000), register shows 0 with overflow', () => {
    const r = run(15, 1)
    expect(r.sumBits).toEqual([0, 0, 0, 0])
    expect(r.decimal).toBe(0)
    expect(r.carryOut).toBe(1)
    expect(r.overflow).toBe(true)
  })

  it('7 + 8: equals 1111 = 15 with no overflow', () => {
    const r = run(7, 8)
    expect(r.decimal).toBe(15)
    expect(r.carryOut).toBe(0)
    expect(r.overflow).toBe(false)
  })

  it('15 + 15: maximum overflow, register holds 14', () => {
    const r = run(15, 15)
    expect(r.decimal).toBe(14)
    expect(r.carryOut).toBe(1)
    expect(r.overflow).toBe(true)
  })
})

describe('alu — input validation', () => {
  it('throws on mismatched bit-width inputs', () => {
    expect(() => alu([0, 1], [0, 1, 0, 1])).toThrow()
  })
})
