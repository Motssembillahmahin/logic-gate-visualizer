# Logic Gate Visualizer

A window into the machine. Watch `5 + 3` travel from a familiar entry point —
a calculator or a PostgreSQL query — all the way down through CPU layers to
gates firing, and back up to the result. Every signal is visible. Nothing is a
black box.

Built for two audiences who meet the same silicon from different doors:

- **HSC students** who know truth tables and gate symbols from the textbook but
  have never seen the gates *do* anything. Entry point: a calculator.
- **CS students and developers** who write SQL daily but have never seen below
  the runtime. Entry point: `SELECT 5 + 3;`.

## The journey (7 layers)

1. **Entry** — pick the calculator or the PostgreSQL terminal.
2. **Numbers** — 5 and 3 become binary (`0101`, `0011`), bit by bit.
3. **Gates** — AND, OR, XOR, NOT react live as you flip inputs.
4. **Adder** — half adder, then full adder with an animated carry.
5. **ALU** — four full adders chained; carry travels left, column by column
   (step through it or watch it run).
6. **CPU** — fetch → decode → execute (with the ALU running inline) → writeback.
7. **Result** — `8` surfaces back to your world (calculator display or psql output).

## Stack

React 18 · Vite · Tailwind CSS · Framer Motion · React Router (hash router for
GitHub Pages). No backend, no API, no database — pure frontend. npm only.

The gate/adder/ALU computation lives entirely in pure functions under
`src/logic/` and is fully unit-tested; components only render and animate it.

## Commands

All commands run through the Makefile:

```
make install   # install dependencies
make dev       # start the dev server
make build     # production build
make preview   # preview the production build locally
make test      # run the test suite (vitest)
make lint      # run ESLint
make deploy    # build and publish to GitHub Pages (gh-pages branch)
```

## Project layout

```
src/
  pages/       one file per layer (EntryPage … ResultPage)
  components/  reusable, animated building blocks (SignalWire, GateSymbol, …)
  logic/       pure functions: gates, half/full adder, 4-bit ALU, binary helpers
  context/     EntryContext — the single piece of global state (entry choice)
```

## Deploy

The Vite `base` is set to `/logic-gate-visualizer/` to match the GitHub Pages
repo path. `make deploy` builds and pushes `dist/` to the `gh-pages` branch via
the `gh-pages` package. This requires the GitHub repo to exist and push
credentials to be configured locally.

Repo: https://github.com/asmmahin/logic-gate-visualizer

## Scope

v1 is one operation — binary addition of `5 + 3` — as a complete vertical slice.
Subtraction, multiplication, memory circuits, a Bangla toggle, and arbitrary
inputs are intentionally out of scope for v1.
