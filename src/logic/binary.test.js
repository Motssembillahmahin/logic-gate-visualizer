import { describe, it, expect } from 'vitest'
import { decimalToBinary, binaryToDecimal, parseBitString } from './binary.js'

// Convention across the app: bit arrays are MSB-first, matching how humans
// write "0101". Default width is 4 (the 4-bit ALU).

describe('decimalToBinary', () => {
  it('converts our headline inputs 5 and 3 to 4-bit MSB-first arrays', () => {
    expect(decimalToBinary(5)).toEqual([0, 1, 0, 1])
    expect(decimalToBinary(3)).toEqual([0, 0, 1, 1])
  })

  it('handles the boundary values 0 and 15', () => {
    expect(decimalToBinary(0)).toEqual([0, 0, 0, 0])
    expect(decimalToBinary(15)).toEqual([1, 1, 1, 1])
  })

  it('respects a custom width', () => {
    expect(decimalToBinary(5, 8)).toEqual([0, 0, 0, 0, 0, 1, 0, 1])
  })

  it('keeps only the low `width` bits (hardware truncation)', () => {
    expect(decimalToBinary(16, 4)).toEqual([0, 0, 0, 0])
  })
})

describe('binaryToDecimal', () => {
  it('reads an MSB-first bit array as a number', () => {
    expect(binaryToDecimal([0, 1, 0, 1])).toBe(5)
    expect(binaryToDecimal([0, 0, 1, 1])).toBe(3)
    expect(binaryToDecimal([1, 0, 0, 0])).toBe(8)
    expect(binaryToDecimal([1, 1, 1, 1])).toBe(15)
  })

  it('is the inverse of decimalToBinary across the 4-bit range', () => {
    for (let n = 0; n <= 15; n++) {
      expect(binaryToDecimal(decimalToBinary(n))).toBe(n)
    }
  })
})

describe('parseBitString', () => {
  it('parses a string of 0s and 1s into an MSB-first bit array', () => {
    expect(parseBitString('0101')).toEqual([0, 1, 0, 1])
    expect(parseBitString('0011')).toEqual([0, 0, 1, 1])
  })

  it('tolerates surrounding whitespace', () => {
    expect(parseBitString('  1000 ')).toEqual([1, 0, 0, 0])
  })

  it('round-trips with binaryToDecimal', () => {
    expect(binaryToDecimal(parseBitString('1111'))).toBe(15)
  })

  it('rejects non-binary characters', () => {
    expect(() => parseBitString('0102')).toThrow()
  })
})
