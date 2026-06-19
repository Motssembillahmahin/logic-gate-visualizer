// Binary helpers. Bit arrays are MSB-first (index 0 is the most significant
// bit), matching how "0101" reads on screen. Default width is 4 (the 4-bit ALU).

export function decimalToBinary(value, width = 4) {
  const bits = []
  for (let i = width - 1; i >= 0; i--) {
    bits.push((value >> i) & 1)
  }
  return bits
}

export function binaryToDecimal(bits) {
  return bits.reduce((acc, bit) => (acc << 1) | (bit & 1), 0)
}

export function parseBitString(str) {
  const trimmed = str.trim()
  if (!/^[01]+$/.test(trimmed)) {
    throw new Error(`Invalid bit string: "${str}" (only 0 and 1 allowed)`)
  }
  return trimmed.split('').map(Number)
}
