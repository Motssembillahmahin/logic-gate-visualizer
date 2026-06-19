import { halfAdder } from './halfAdder.js'
import { or } from './gates.js'

// Full adder: two chained half adders.
// First half-add a + b, then half-add that sum with carryIn.
// carryOut is high if either half adder produced a carry.
export function fullAdder(a, b, carryIn) {
  const first = halfAdder(a, b)
  const second = halfAdder(first.sum, carryIn)
  return {
    sum: second.sum,
    carryOut: or(first.carry, second.carry),
  }
}
