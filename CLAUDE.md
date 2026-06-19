# CLAUDE.md

Instructions for Claude Code working on this project.
Read vision.md first. Then read this file. Then read state.md.

---

## What we are building

An interactive visualization where a user watches 5 + 3 travel from their
entry point (calculator or PostgreSQL) all the way down through CPU layers
to gates firing and back up to the result. Every signal is visible. Nothing
is a black box.

---

## Stack

- React 18 with Vite
- Tailwind CSS
- Framer Motion (signal animations, layer transitions)
- React Router (hash router — required for GitHub Pages)
- No backend. No API. No database. Pure frontend.

## Package manager

npm only. No yarn, no pnpm.

## Commands (Makefile)

Always add commands to the Makefile. Never tell the user to run raw npm commands.

```
make dev       → npm run dev
make build     → npm run build
make preview   → npm run preview
make deploy    → npm run build && npx gh-pages -d dist
make lint      → npm run lint
```

---

## Project structure — do not deviate

```
src/
  pages/
    EntryPage.jsx          ← user picks: calculator or PostgreSQL
    NumbersPage.jsx        ← 5 and 3 become binary, visually
    GatesPage.jsx          ← AND, OR, XOR, NOT with live signals
    AdderPage.jsx          ← half adder → full adder, carry animated
    ALUPage.jsx            ← 4-bit ALU, carry travels left, step-through
    CPUPage.jsx            ← fetch → decode → execute → writeback
    ResultPage.jsx         ← result surfaces back: display or psql
  components/
    SignalWire.jsx         ← animated wire carrying a 0 or 1
    GateSymbol.jsx         ← SVG gate shape, lights up on activation
    BitToggle.jsx          ← clickable bit button
    TruthTable.jsx         ← highlights active row
    AdderColumn.jsx        ← one full adder column with all signals
    CPULayer.jsx           ← one CPU cycle stage card
    EntryCard.jsx          ← calculator or PostgreSQL entry option card
    PageNav.jsx            ← previous / next navigation
  logic/
    gates.js               ← pure functions: and, or, xor, not
    halfAdder.js
    fullAdder.js
    alu.js                 ← chains four full adders, returns full state
    binary.js              ← decimalToBinary, binaryToDecimal, parseBitString
  context/
    EntryContext.jsx       ← single shared state: which entry point was chosen
  App.jsx
  main.jsx
```

---

## Critical rules

### Logic layer is sacred

All gate computation lives in `/logic` as pure functions. No exceptions.

```js
// gates.js
export const and = (a, b) => a & b;
export const or  = (a, b) => a | b;
export const xor = (a, b) => a ^ b;
export const not = (a)    => a ^ 1;
```

If gate logic appears inside a component, it is wrong. Move it to logic/.

### Entry point context

This is the only global state. It is set once on EntryPage and read by
ResultPage to determine what the user sees at the end.

```js
// context/EntryContext.jsx
const EntryContext = createContext(null);
// value: 'calculator' | 'postgresql'
```

Every other state is local to its page.

### Component size

No component file exceeds 150 lines. Extract sub-components aggressively.

### Animation is not optional

The visualization IS the product. If a signal does not visibly travel through
a wire, if a gate does not visibly switch state, if carry does not visibly
move left — it is not done. Framer Motion handles all animation.

### Framer Motion scope

Use only for:
- SignalWire: strokeDashoffset path drawing to show signal travel
- GateSymbol: opacity/color transition when gate activates
- AdderColumn: carry_out animating into next column's carry_in
- CPULayer: cards expanding in sequence
- Page transitions (fade only, keep it subtle)

Do not use for hover states or color changes. Those are Tailwind.

### Hash router

Required for GitHub Pages. Use `createHashRouter`. No exceptions.

### What is not state

Never put these in useState — they are derived values:
- Gate outputs (compute from inputs via logic/)
- ALU results (compute from bitsA, bitsB via alu.js)
- Binary representations (compute via binary.js)
- Truth table active row (derive from current inputs)

---

## Page-specific notes

### EntryPage (Page 1)

Two cards side by side:
- Left: calculator showing "5 + 3 = ?" — for HSC students
- Right: terminal showing "SELECT 5 + 3;" — for CS students

User clicks one. Choice is saved to EntryContext. Both paths go to the
same pages after this. Only ResultPage changes based on the choice.

No back button on this page.

### NumbersPage (Page 2)

Show 5 and 3 converting to binary with animation:
- Decimal 5 → bits lighting up one by one → 0101
- Decimal 3 → bits lighting up one by one → 0011

Use binary.js for conversion. Animate using Framer Motion stagger.
This page establishes the visual language of bits that all later pages use.

### GatesPage (Page 3)

Four gate cards: AND, OR, XOR, NOT.
SignalWire components carry signals from input bits to gate to output.
When input toggles, signal travels visibly through the wire to the gate,
gate symbol lights up, output wire carries the result.
XOR gets a visual accent — it is the key gate for addition.
Truth table highlights active row in real time.

### AdderPage (Page 4)

Two sections on one page:

Section 1 — Half adder:
- Inputs A=1, B=1 (from our 5+3, bit 0)
- XOR wire → Sum output
- AND wire → Carry output
- Animate both paths simultaneously

Section 2 — Full adder:
- Add carry_in input, visually distinct (different wire color)
- Show two-stage chain
- Carry_out exits left with directional arrow
- Plain English label updates: "carry_out moves to the next column"

### ALUPage (Page 5)

Four AdderColumn components side by side, bit 0 on the right.
Fixed inputs: A=0101 (5), B=0011 (3).

Two modes:
- Auto: click Run, all columns animate left to right with carry traveling
  between columns, 500ms per column
- Step: Next button advances one column, user watches carry arrive and leave

Overflow badge if carry exits bit 3.
Result bar shows binary and decimal below the columns.
canProceed requires completing at least one full run.

### CPUPage (Page 6)

Four CPULayer cards expanding in sequence:

1. Fetch: ADD instruction pulled from memory, address bus lights up
2. Decode: control unit reads opcode 5 and 3 load into registers,
   register values shown
3. Execute: ALU fires — this embeds a mini read-only ALU visualization
   showing the gates actually switching. Not a link, inline.
4. Writeback: result 8 lands in register, memory address lights up

User clicks each card to expand. Card N only opens after card N-1 is open.
This enforces the learning sequence.

### ResultPage (Page 7)

Reads EntryContext to show the correct ending:

Calculator path:
- Animated calculator display showing "8" lighting up
- Brief caption: "This is what happened inside when you pressed ="

PostgreSQL path:
- Terminal output: "?column? / -------- / 8"
- Brief caption: "This is what happened inside when PostgreSQL ran your query"

Both paths show a final summary: the full layer stack the signal traveled
through, collapsed into one diagram. Shareable.

---

## Edge cases to test manually

- 0 + 0 (all zeros, no carry anywhere)
- 15 + 1 (0b1111 + 0b0001, carry exits bit 3, result = 10000 = 16)
- 7 + 8 (0b0111 + 0b1000 = 0b1111 = 15, no overflow)
- 15 + 15 (maximum overflow)
- Full adder: carry_in=1, A=0, B=0 → sum=1, carry_out=0

---

## Deployment

GitHub Pages. Set base in vite.config.js to the actual repo name:

```js
export default defineConfig({
  base: '/logic-gate-visualizer/',
  plugins: [react()],
})
```

Repo: https://github.com/asmmahin/logic-gate-visualizer

`make deploy` handles build and push to gh-pages branch.
