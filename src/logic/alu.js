import { fullAdder } from './fullAdder.js'
import { binaryToDecimal } from './binary.js'

// 4-bit (or N-bit) ripple-carry ALU for addition.
// Inputs are MSB-first bit arrays. Adds from bit 0 (LSB, rightmost) upward,
// carrying left into the next column — exactly what the visualization shows.
//
// Returns:
//   columns:  per-column state, LSB-first (columns[0] is bit 0).
//             each: { bit, a, b, carryIn, sum, carryOut }
//   sumBits:  MSB-first sum array (truncated to input width)
//   decimal:  decimal value of the truncated register
//   carryOut: final carry out of the most significant bit
//   overflow: true when carryOut is 1 (the result did not fit)
export function alu(bitsA, bitsB) {
  if (bitsA.length !== bitsB.length || bitsA.length === 0) {
    throw new Error('alu: inputs must be non-empty arrays of equal width')
  }

  const width = bitsA.length
  const columns = []
  const sumByPosition = []
  let carry = 0

  for (let bit = 0; bit < width; bit++) {
    const index = width - 1 - bit // LSB lives at the end of an MSB-first array
    const a = bitsA[index]
    const b = bitsB[index]
    const { sum, carryOut } = fullAdder(a, b, carry)

    columns.push({ bit, a, b, carryIn: carry, sum, carryOut })
    sumByPosition[bit] = sum
    carry = carryOut
  }

  // sumByPosition is LSB-first; reverse it back to MSB-first for display.
  const sumBits = sumByPosition.slice().reverse()

  return {
    columns,
    sumBits,
    decimal: binaryToDecimal(sumBits),
    carryOut: carry,
    overflow: carry === 1,
  }
}
