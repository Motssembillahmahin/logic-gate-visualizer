# vision.md — Strategic Anchor

This file does not change sprint to sprint.
Agents read it to understand what the project is building toward.
If an agent is unsure whether a decision is right, the answer is in here.

---

## The core vision

A window into the machine. Not a tutorial. Not a textbook companion.

The user watches computation actually happen — signal by signal, gate by gate,
layer by layer — from their familiar world down to silicon and back up.

Nothing is a black box. Everything is visible.

---

## Two entry points. One machine.

```
HSC student enters here:          CS student enters here:
"What happens when a              "What happens when
calculator computes 5 + 3?"       PostgreSQL runs SELECT 5 + 3?"
        ↓                                   ↓
        →  →  →  →  same machine  ←  ←  ←  ←
                          ↓
               Registers load: 5 and 3
                          ↓
               CPU fetches ADD instruction
                          ↓
               ALU fires: gates open, carry travels left
                          ↓
               Result writes back: 8
                          ↓
HSC student sees:                 CS student sees:
display lights up "8"             psql prints 8
```

Gates do not care whether the input came from a calculator button or a SQL
parser. The silicon behaves identically. That is the insight both audiences
must feel by the end.

---

## Who it is for

**HSC students (Class 11-12, Bangladesh)**
They know truth tables, gate symbols, Boolean algebra, and number conversion
from their ICT textbook (Chapter 3). They have never seen these gates do
anything real. The calculator is their entry point — something they have used
thousands of times without knowing what is happening inside.

**CS students and developers**
They write code daily. They have never seen below the language runtime. The
PostgreSQL query is their entry point — something familiar that secretly
bottoms out at gate-level execution.

---

## What the visualization must feel like

The user should feel like they are looking inside a running machine with the
cover off. Not reading about it. Watching it.

- Signals travel visibly through wires
- Gates open and close as inputs change
- Carry propagates left column by column in real time
- Each CPU layer activates in sequence: fetch, decode, execute, writeback
- The user can pause, step through, or slow down at any layer

Every layer is animated. Every signal is visible.

---

## v1 scope — non-negotiable

One operation. Binary addition. The complete vertical slice.

```
Layer 1 — Entry point selection (calculator or PostgreSQL)
Layer 2 — Number representation (5 and 3 become binary)
Layer 3 — Basic gates (AND, OR, XOR, NOT) with live signals
Layer 4 — Half adder → Full adder (carry_in, carry_out animated)
Layer 5 — 4-bit ALU (four full adders chained, carry travels left)
Layer 6 — CPU cycle (fetch ADD instruction, decode, execute in ALU, writeback)
Layer 7 — Result surfaces back to the user's world (display or psql)
```

v1 ships when a user can watch 5 + 3 travel from their entry point all the
way down to gates firing and back up to the result — without anything being
a black box.

---

## Success criteria

An HSC student who never understood carry puts 5 + 3 through the calculator
entry point, watches the gates fire, and says:
"so carry_out does not stay in that column — it physically moves left."

A developer who has written SQL for two years goes through the PostgreSQL
entry point and finally understands what the ALU is actually doing when
their query runs.

Both of them share the link.

---

## What this is not

- Not a textbook replacement
- Not trying to cover subtraction, multiplication, or memory circuits in v1
- Not bilingual in v1 (English only, Bangla in v2)
- Not a static explainer — if it is not animated and interactive, it is wrong

---

## v2 and beyond (do not build now)

- Subtraction via 2's complement (HSC textbook already covers this)
- Multiplication and division
- Memory circuits: flip-flops, registers, RAM visualization
- Full CPU pipeline with pipeline stages
- Bangla language toggle
- User can input any two numbers, not just 5 + 3
