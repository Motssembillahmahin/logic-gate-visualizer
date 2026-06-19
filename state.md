# state.md — Live Loop State

Most important file in the project for loop engineering.
Claude Code updates this file at the end of every session.
You check this file to know what needs attention before firing the next loop.

**Rule:** If a session ends without updating this file, the loop is broken.

---

## Current status

**Overall:** v1 BUILD COMPLETE — all polish/tests/README done; only the GitHub Pages deploy remains (needs a human)
**Last updated:** 2026-06-19
**Last agent:** Agent 8 — Polish + Deploy (polish complete; deploy blocked on human)
**Blocking on human:** Yes — deploy needs a git repo + GitHub push auth (see below)

---

## What needs a human right now

- [x] Create GitHub repo and confirm the repo name
      Repo: logic-gate-visualizer → base: '/logic-gate-visualizer/' set in CLAUDE.md
- [x] Confirm Node.js 18+ is available locally
      Verified: Node v20.19.4, npm 9.2.0
- [x] Run Agent 1 to initialize the project
      Done — `make build` and `make lint` both pass

**Deploy to GitHub Pages needs a human.** The project directory is not a git
repository and there is no configured remote or push auth, so `make deploy`
cannot run autonomously. To publish:

- [ ] Create the GitHub repo `logic-gate-visualizer` (owner asmmahin) if it does
      not exist. The Vite `base` is already `/logic-gate-visualizer/` to match.
- [ ] From this directory: `git init`, commit, add the remote
      (`git remote add origin git@github.com:asmmahin/logic-gate-visualizer.git`),
      and push `main`.
- [ ] Authenticate for push (SSH key or `gh auth login`).
- [ ] Run `make deploy` (builds and pushes `dist/` to the `gh-pages` branch).
- [ ] In the repo settings, set GitHub Pages to serve from the `gh-pages` branch.

Everything else is done: 91 tests + lint + production build all green, README
written, responsive pass complete. The app runs locally now via `make dev`.

---

## In progress

_Agent 8 polish work complete. Only the GitHub Pages deploy remains — blocked on
a human (git repo + push auth). See "What needs a human right now" above._

---

## Agent pipeline

| Agent | Name            | Status      | Notes                          |
|-------|-----------------|-------------|--------------------------------|
| 1     | Scaffold        | complete    | build + lint green             |
| 2     | Logic Layer     | complete    | 26 tests green, fully covered  |
| 3     | Shared Components | complete  | 8 components, 29 component tests |
| 4     | Entry + Numbers | complete    | pages live, EntryContext wired |
| 5     | Gates + Adder   | complete    | live signals, derived outputs  |
| 6     | ALU             | complete    | step + auto, carry animation   |
| 7     | CPU + Result    | complete    | inline ALU + entry-point ending |
| 8     | Polish + Deploy | partial     | polish/README/tests done; deploy needs human |

---

## Failed / needs retry

_Nothing failed yet._

---

## Decisions made (do not revisit)

| Decision | Reason |
|----------|--------|
| Dual entry point (calculator + PostgreSQL) | HSC and CS students have different mental models — same machine, two ways in |
| No backend | Pure visualization, nothing to persist in v1 |
| Hash router | Required for GitHub Pages, no server-side routing |
| EntryContext is the only global state | Entry choice affects only ResultPage — everything else is local |
| Animation is not optional | The visualization IS the product — static explainer is wrong |
| Fixed inputs 5 + 3 | Keeps scope tight for v1, user can explore by toggling bits on ALUPage |
| English only | Wider reach, Bangla toggle is v2 |
| npm | Consistency, no strong reason to prefer yarn |

---

## Open questions

| Question | Raised by | Status |
|----------|-----------|--------|
| CPUPage: inline mini ALU or link to ALUPage? | CLAUDE.md | decided — inline, not a link |
| SignalWire color for carry_in vs regular inputs? | design | decided in Agent 3 — carry = amber signal-carry (#f59e0b), live 1 = cyan signal-on (#22d3ee), 0 = slate signal-off (#475569) |
| Auto mode speed: 500ms per column — too fast? | CLAUDE.md | decided in Agent 6 — kept 500ms as named constant STEP_MS in ALUPage.jsx; easy to tune. Revisit during Agent 8 polish/mobile pass if it reads too fast. |
| EntryPage: should both cards be equally weighted or HSC card slightly more prominent? | design | open |

---

## Session log

_Append after every Claude Code session. Never edit previous entries._

### Format
```
### Session [N] — [Date]
Agent: [which agent]
Completed:
Incomplete / left for next session:
Pipeline changes:
New blockers for human:
New open questions:
```

---

### Session 1 — 2026-06-19
Agent: Agent 1 — Scaffold
Completed:
- Verified prerequisites: Node v20.19.4, npm 9.2.0 (both >= 18).
- npm + Vite + React 18 project initialized; installed react, react-dom,
  react-router-dom, framer-motion, tailwindcss, postcss, autoprefixer, eslint,
  gh-pages, @vitejs/plugin-react.
- Config: vite.config.js (base '/logic-gate-visualizer/'), tailwind.config.js
  (with a shared `signal` color palette: on/off/carry), postcss.config.js,
  .eslintrc.cjs, .gitignore, index.html, src/index.css.
- Full directory structure per CLAUDE.md created with stub files for all 7
  pages, 8 components, 5 logic modules, and EntryContext.
- App.jsx wires all 7 routes via createHashRouter; EntryProvider implemented.
- Makefile with dev/build/preview/deploy/lint/install targets.
- `make build` passes (42 modules, Tailwind CSS emitted); `make lint` passes.
Incomplete / left for next session:
- All page/component/logic internals are placeholders — real implementation
  starts with Agent 2 (Logic Layer).
Pipeline changes:
- Agent 1 → complete. Agent 2 (Logic Layer) is now unblocked.
New blockers for human: None.
New open questions: None new. (Tentatively seeded a carry color #f59e0b in the
Tailwind `signal` palette — Agent 3 still owns the final SignalWire color call.)

### Session 2 — 2026-06-19
Agent: Agent 2 — Logic Layer
Completed:
- Installed vitest; added `test`/`test:watch` npm scripts and a `make test`
  target. Tests live next to source as src/logic/*.test.js.
- Implemented all five logic modules via strict TDD (red → green per module):
  - gates.js: and/or/xor/not (bitwise, per CLAUDE.md spec).
  - binary.js: decimalToBinary, binaryToDecimal, parseBitString.
    Convention: bit arrays are MSB-first; default width 4.
  - halfAdder.js: { sum, carry } built from xor/and.
  - fullAdder.js: { sum, carryOut } from two half adders + or. Full truth table.
  - alu.js: N-bit ripple-carry adder. Returns columns (LSB-first, each with
    a/b/carryIn/sum/carryOut), sumBits (MSB-first), decimal, carryOut, overflow.
- 26 tests pass; all CLAUDE.md edge cases covered (0+0, 15+1, 7+8, 15+15,
  full-adder carryIn). make test + make lint + make build all green.
Incomplete / left for next session:
- No UI yet. Agent 3 (Shared Components) is next.
Pipeline changes:
- Agent 2 → complete. Agent 3 (Shared Components) is now unblocked.
New blockers for human: None.
New open questions: None.

### Session 8 — 2026-06-19
Agent: Agent 8 — Polish + Deploy
Completed:
- Responsive pass: wrapped the four-column ALU rows (ALUPage + CPUPage inline
  ALU) in overflow-x-auto so they scroll instead of breaking layout on narrow
  screens. Verified gate grid (sm:grid-cols-2 → 1 col) and number/adder rows fit
  mobile widths.
- Edge cases: confirmed CLAUDE.md cases (0+0, 15+1, 7+8, 15+15, full-adder
  carry_in) are covered green by alu.test.js; overflow badge is wired to
  result.overflow so it is correct for any inputs (v1 ships fixed 5+3).
- Wrote README.md (overview, the 7 layers, stack, make commands, layout, deploy).
- Final state: 91 tests + lint + production build all green.
Incomplete / left for next session:
- GitHub Pages deploy. The directory is not a git repo and has no remote/auth,
  so `make deploy` cannot run autonomously. Steps for a human are listed under
  "What needs a human right now". I did NOT init git / create a repo / push —
  that is an outward, credential-bearing action for the owner to perform.
Pipeline changes:
- Agent 8 → partial (polish complete, deploy pending human). Pipeline build work
  is otherwise DONE — the full v1 slice runs locally via make dev.
New blockers for human: Deploy (git repo + GitHub push auth). See above.
New open questions: None.

### Session 7 — 2026-06-19
Agent: Agent 7 — CPU + Result
Completed:
- CPUPage: four CPULayer cards (Fetch, Decode, Execute, Writeback) that open in
  sequence (a stage unlocks once the prior one has been opened). Execute embeds
  an INLINE read-only mini ALU (alu(5,3) + AdderColumns, no controls). Decode
  shows R1/R2 loading 5 and 3; Writeback shows 1000 = 8. PageNav next→/result
  gated until all four stages opened. TDD'd (sequence + inline ALU + gating).
- ResultPage: reads useEntry().entryPoint. calculator → animated display
  lighting up 8 + "when you pressed =" caption; postgresql → psql terminal
  output (?column? / 8) + "when PostgreSQL ran your query" caption; null →
  graceful fallback with a link back to Entry (handles deep-link/refresh since
  EntryContext is in-memory). Both chosen paths show the 7-layer stack summary.
  TDD'd all three branches + summary.
- 11 new tests; 91 total. make test/lint/build all green.
- The full v1 vertical slice is now navigable end to end.
Incomplete / left for next session:
- Agent 8: edge-case pass, mobile/responsive check, README, GitHub Pages deploy.
Pipeline changes:
- Agent 7 → complete. Agent 8 (Polish + Deploy) is now unblocked.
New blockers for human: None yet — but the deploy push will need GitHub auth.
New open questions: None.

### Session 6 — 2026-06-19
Agent: Agent 6 — ALU
Completed:
- ALUPage: fixed A=0101(5), B=0011(3) → alu(); four AdderColumns rendered from
  result.columns with bit 0 on the RIGHT (display reversed). Result bar shows
  1000 = 8, no overflow badge (correct for 5+3).
- Step mode: Next lights bit 0 first, carry advances left column by column.
  Auto mode: Run advances every STEP_MS (500ms) until carry exits bit 3.
  Reset returns to no-active. canProceed (everCompleted) gates PageNav next→/cpu
  via nextDisabled until a full run finishes.
- TDD'd the state machine + render (7 tests). Added a fake-timer regression test
  for Auto mode (8 total on page); Auto was built alongside Step sharing the same
  state machine, so that slice is verified rather than strictly test-first.
- 8 new tests; 80 total. make test/lint/build all green.
- Resolved the 500ms auto-speed open question (kept as named const STEP_MS).
Incomplete / left for next session:
- CPUPage and ResultPage still scaffold stubs — Agent 7 (the final pages).
Pipeline changes:
- Agent 6 → complete. Agent 7 (CPU + Result) is now unblocked.
New blockers for human: None.
New open questions: None.

### Session 5 — 2026-06-19
Agent: Agent 5 — Gates + Adder
Completed:
- GatesPage: shared A/B inputs (BitToggle) drive four gate cards (AND, OR, XOR,
  NOT) built from GateSymbol + SignalWire + per-gate TruthTable. Outputs computed
  via logic/gates.js (no inline boolean logic). Toggling an input recomputes all
  cards + truth-table highlight live. XOR accent via GateSymbol. TDD'd.
- AdderPage: half adder (fixed A=1,B=1 from 5+3 bit 0) via halfAdder.js (sum 0,
  carry 1); full adder (A=1,B=1, toggleable carry_in) via fullAdder.js with a
  carry-out arrow animating left + "carry_out moves to the next column" label.
  TDD'd, incl. carry_in toggle flipping the sum.
- 9 new page tests; 72 total. make test/lint/build all green.
Incomplete / left for next session:
- ALUPage, CPUPage, ResultPage still scaffold stubs.
Pipeline changes:
- Agent 5 → complete. Agent 6 (ALU) is now unblocked.
New blockers for human: None.
New open questions: None. (Auto-mode 500ms-per-column speed question is still
open — slated for testing after Agent 6 builds ALUPage.)

### Session 4 — 2026-06-19
Agent: Agent 4 — Entry + Numbers
Completed:
- EntryPage: two EntryCards (calculator "5 + 3 = ?", PostgreSQL "SELECT 5 + 3;").
  Selecting one sets EntryContext via useEntry().setEntryPoint and navigates to
  /numbers. No back button (per spec). TDD: tested selection + routing + context.
- NumbersPage: animates 5→0101 and 3→0011 with Framer Motion stagger (bits light
  up one by one). Uses decimalToBinary from logic. PageNav prev=/ next=/gates.
  TDD: tested binary conversion output and onward nav.
- 8 new page tests; 63 total. make test/lint/build all green.
- Build now bundles framer-motion (JS ~324kB) since pages import components.
Incomplete / left for next session:
- GatesPage and AdderPage still scaffold stubs — Agent 5.
Pipeline changes:
- Agent 4 → complete. Agent 5 (Gates + Adder) is now unblocked.
New blockers for human: None.
New open questions: None.

### Session 3 — 2026-06-19
Agent: Agent 3 — Shared Components
Completed:
- Set up component test environment: jsdom + @testing-library/react +
  jest-dom, vitest.config.js (jsdom env, globals, setupFiles), src/test/setup.js.
- TDD-built all 8 shared components (red→green per group), NO page assembly:
  - BitToggle: clickable bit, aria-pressed, disabled guard.
  - EntryCard: full-card button, title/description, onSelect.
  - PageNav: react-router prev/next links; nextDisabled → disabled button.
  - SignalWire: SVG wire, data-value/active/carry, Framer Motion path draw.
  - GateSymbol: gate card by type, activation glow, XOR accent.
  - TruthTable: highlights the row matching current inputs (data-active).
  - AdderColumn: renders straight from an alu() column object; carry arrow.
  - CPULayer: sequenced expand; locked card cannot open.
- 29 new component tests; 55 total. make test/lint/build all green.
- Resolved the open SignalWire carry-color question (see Decisions/Open above).
Incomplete / left for next session:
- Components are unimported by pages (so tree-shaken from the build for now);
  Agent 4+ wires them into pages. Tests cover them directly.
Pipeline changes:
- Agent 3 → complete. Agent 4 (Entry + Numbers) is now unblocked.
New blockers for human: None.
New open questions: None.
