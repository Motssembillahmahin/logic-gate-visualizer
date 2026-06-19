import { xor, and } from './gates.js'

// Half adder: adds two bits.
// sum = a XOR b, carry = a AND b.
export function halfAdder(a, b) {
  return {
    sum: xor(a, b),
    carry: and(a, b),
  }
}
