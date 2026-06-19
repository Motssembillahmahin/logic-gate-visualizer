// Pure gate functions — the sacred core of the project.
// All inputs/outputs are bits (0 or 1). No UI, no side effects.
export const and = (a, b) => a & b
export const or = (a, b) => a | b
export const xor = (a, b) => a ^ b
export const not = (a) => a ^ 1
