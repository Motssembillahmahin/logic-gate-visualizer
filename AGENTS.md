# AGENTS.md — Living Memory

This file is updated by Claude Code after every agent run.
It accumulates discovered patterns, gotchas, and conventions.
Future agent sessions must read this file before starting work.

---

## How to use this file

Before starting any agent task:
1. Read the "Conventions" section
2. Read the "Gotchas" section
3. Check "Agent Run Log" for what the previous agent did and left behind

After completing any agent task:
1. Append a new entry to "Agent Run Log"
2. Add any new patterns or gotchas discovered
3. Note anything broken or incomplete for the next agent

---

## Agent responsibilities

| Agent | Name              | Responsibility                                      |
|-------|-------------------|-----------------------------------------------------|
| 1     | Scaffold          | Project init, Makefile, directory structure, empty files |
| 2     | Logic Layer       | Pure functions in /logic only, no UI                |
| 3     | Shared Components | All reusable components, no page assembly           |
| 4     | Entry + Numbers   | EntryPage and NumbersPage                           |
| 5     | Gates + Adder     | GatesPage and AdderPage                             |
| 6     | ALU               | ALUPage with step-through and auto mode             |
| 7     | CPU + Result      | CPUPage and ResultPage, entry context integration   |
| 8     | Polish + Deploy   | Edge cases, mobile check, README, GitHub Pages live |

---

## Conventions

- **Build/lint gate:** every agent must leave `make build` AND `make lint`
  passing. Lint runs with `--max-warnings 0`, so warnings fail the build too.
- **No PropTypes:** `react/prop-types` is turned OFF in .eslintrc.cjs. Do not
  add PropTypes; do not re-enable the rule.
- **Shared color palette:** Tailwind exposes a `signal` color group —
  `signal-on` (#22d3ee, live 1), `signal-off` (#475569, idle 0),
  `signal-carry` (#f59e0b, carry). Use these classes for signal coloring so
  every page speaks the same visual language. Extend the palette in
  tailwind.config.js rather than hardcoding hex in components.
- **Dark theme baseline:** body is slate-900 (#0f172a) with slate-200 text,
  set in src/index.css. Build on this; don't fight it per-page.
- **Routes:** `/` Entry, `/numbers`, `/gates`, `/adder`, `/alu`, `/cpu`,
  `/result` — wired in src/App.jsx via createHashRouter.
- **Stub marker:** every placeholder file names the agent that owns its real
  implementation in a top comment. When you implement a file, replace that
  comment.
- **TDD for any logic/behavior:** tests live beside source as `*.test.js`,
  import `{ describe, it, expect } from 'vitest'` explicitly (no globals — keeps
  ESLint happy). Write the test, watch it fail, then implement. Run `make test`.
- **Bit convention (project-wide):** bit arrays are MSB-first (index 0 = most
  significant), matching how "0101" reads. Default width is 4. UI components
  must follow this — decimalToBinary(5) is [0,1,0,1].
- **Component test env (Agent 3):** vitest runs under jsdom (vitest.config.js).
  Test files import `{ describe, it, expect, vi }` from 'vitest' explicitly
  (lint), and `render/screen/fireEvent` from @testing-library/react. jest-dom
  matchers (toBeInTheDocument, toHaveAttribute) come from src/test/setup.js.
  Components carry stable `data-testid`/`data-*` hooks for assertions — keep
  them when editing a component, pages should not rely on CSS classes for state.
- **Wrap router-aware components in a router when testing:** PageNav (and any
  page) uses react-router; tests render inside `<MemoryRouter>`. Note Link href
  is `/path` under MemoryRouter but `#/path` under the app's HashRouter — assert
  with `.toContain('/path')`, not an exact `#/...` match.
- **react/no-unescaped-entities fails lint on literal `"` and `'` in JSX text**
  (e.g. `knows "5"` or `don't`). Rephrase, or use `&quot;`/`&ldquo;`/`&rsquo;`.
  This bit Agent 4 — prose-heavy pages will hit it. `--max-warnings 0` = error.
- **Testing a page that selects an entry point:** render it inside both
  `<EntryProvider>` and `<MemoryRouter>` with a `<Routes>` that maps the target
  route to a small probe reading `useEntry()`, then assert the probe shows the
  stored value after the click (covers context + navigation in one test).

---

## Logic layer API (Agent 2 — stable, consume freely; do NOT reimplement)

All in `src/logic/`, pure functions, fully tested (26 tests):

- `gates.js`: `and(a,b)`, `or(a,b)`, `xor(a,b)`, `not(a)` — bits in, bit out.
- `binary.js`:
  - `decimalToBinary(value, width=4)` → MSB-first bit array (truncates to width).
  - `binaryToDecimal(bits)` → number (MSB-first input).
  - `parseBitString(str)` → bit array; throws on non-binary chars.
- `halfAdder.js`: `halfAdder(a,b)` → `{ sum, carry }`.
- `fullAdder.js`: `fullAdder(a,b,carryIn)` → `{ sum, carryOut }`.
- `alu.js`: `alu(bitsA, bitsB)` (equal-width MSB-first arrays) →
  `{ columns, sumBits, decimal, carryOut, overflow }` where
  `columns` is LSB-first (columns[0] = bit 0), each
  `{ bit, a, b, carryIn, sum, carryOut }`. This per-column shape is exactly
  what ALUPage/AdderColumn animate — `columns[i].carryOut === columns[i+1].carryIn`.

---

## Shared components API (Agent 3 — stable, consume in pages; do NOT rebuild)

All in `src/components/`, tested (29 tests). Props summary:

- `<BitToggle value={0|1} onToggle disabled? label? />` — clickable bit button.
- `<EntryCard title description onSelect accent? >children</EntryCard>` — whole
  card is the button.
- `<PageNav prev={{to,label}} next={{to,label}} nextDisabled? />` — prev/next.
  prev/next omitted when falsy (EntryPage passes no prev). Uses react-router
  `Link`, so render pages inside the router.
- `<SignalWire value={0|1} active? carry? vertical? length? />` — animated wire.
- `<GateSymbol type="AND|OR|XOR|NOT" active />` — gate that glows when active.
- `<TruthTable inputs={[...]} outputLabel rows={[{in:[...],out}]} active={[...]} />`
  — highlights the row whose `in` array equals `active`.
- `<AdderColumn column={aluColumn} active? />` — pass one `alu().columns[i]`
  object directly; it renders A/B/carryIn/sum/carryOut and a carry arrow.
- `<CPULayer title isOpen locked? onToggle step? >body</CPULayer>` — expand card;
  `locked` blocks opening (page owns the open-in-sequence state).

Color language: `signal-on` cyan (#22d3ee, live 1), `signal-off` slate
(#475569, 0), `signal-carry` amber (#f59e0b, carry).

---

## Gotchas

- **ESLint react/recommended is strict:** `plugin:react/recommended` flags
  `children` (and any prop) as missing prop validation. We disabled
  `react/prop-types` to handle this once, project-wide. If you see a
  prop-validation error, it's the rule — don't add PropTypes, the rule should
  already be off.
- **Context + Fast Refresh:** EntryContext.jsx exports both a component
  (`EntryProvider`) and a hook (`useEntry`). The hook export carries an
  `// eslint-disable-next-line react-refresh/only-export-components` line.
  Keep it, or split the hook into its own file, if you touch that file.
- **Makefile needs real tabs:** recipe lines are tab-indented, not spaces.
  Verify with `cat -A Makefile` if you edit it.
- **Vite base path:** dev (`make dev`) serves at root, but the built app is
  scoped to `/logic-gate-visualizer/`. Use react-router `Link`/relative paths,
  never hardcode a leading-slash asset URL, or it'll 404 on GitHub Pages.
- **Vitest config:** none needed — vitest auto-discovers `*.test.js` and runs
  in the default (node) environment, which is fine for pure logic. If Agent 3+
  needs to test React components, add `environment: 'jsdom'` + @testing-library
  and a vitest.config.js; don't assume a DOM exists by default.
- **ESLint env is browser-only:** logic tests pass because they import vitest
  symbols explicitly. If you write a test using node globals, add the env or it
  fails lint (`--max-warnings 0`).

---

## Agent Run Log

_Append a new entry after every agent session. Do not edit previous entries._

### Format

```
## Run [N] — [Agent Name] — [Date]
Status: complete | partial | failed
What was done:
What was left incomplete:
Files created or modified:
Patterns discovered:
Gotchas hit:
Handoff notes for next agent:
```

---

## Run 1 — Scaffold — 2026-06-19
Status: complete
What was done:
- Initialized npm + Vite + React 18 project; installed all stack deps
  (react, react-dom, react-router-dom, framer-motion, tailwind, postcss,
  autoprefixer, eslint + react plugins, gh-pages, @vitejs/plugin-react).
- Wrote all config: vite.config.js (base '/logic-gate-visualizer/'),
  tailwind.config.js (signal palette), postcss.config.js, .eslintrc.cjs,
  .gitignore, index.html, src/index.css.
- Created the full CLAUDE.md directory structure with stub files: 7 pages,
  8 components, 5 logic modules, EntryContext.
- App.jsx wires all 7 routes via createHashRouter; EntryProvider implemented.
- Makefile: dev/build/preview/deploy/lint/install.
- Verified: `make build` passes (42 modules), `make lint` passes (0 warnings).
What was left incomplete:
- All page/component/logic bodies are placeholders. Real work begins Agent 2.
Files created or modified:
- package.json, package-lock.json, vite.config.js, tailwind.config.js,
  postcss.config.js, .eslintrc.cjs, .gitignore, index.html, Makefile,
  src/index.css, src/main.jsx, src/App.jsx, src/context/EntryContext.jsx,
  src/pages/*.jsx (7), src/components/*.jsx (8), src/logic/*.js (5).
Patterns discovered:
- See Conventions: build+lint gate, no PropTypes, signal color palette.
Gotchas hit:
- `react/prop-types` from plugin:react/recommended failed lint on the
  EntryProvider `children` prop. Resolved by disabling the rule project-wide.
  (See Gotchas.)
Handoff notes for next agent (Agent 2 — Logic Layer):
- Logic files exist as empty stubs in src/logic/ with spec comments. Implement
  them as PURE functions (no UI), ideally TDD. CLAUDE.md gives exact signatures
  for gates.js. alu.js must return per-column state + an overflow flag so the
  ALUPage can animate carry between columns.
- Test the edge cases listed in CLAUDE.md (0+0, 15+1, 7+8, 15+15, full-adder
  carry_in cases). There is no test runner installed yet — Agent 2 should add
  one (e.g. vitest) and a `make test` target, then keep build+lint green.

## Run 2 — Logic Layer — 2026-06-19
Status: complete
What was done:
- Installed vitest; added `test`/`test:watch` scripts + `make test`.
- TDD-implemented all five logic modules (red->green each):
  gates.js, binary.js, halfAdder.js, fullAdder.js, alu.js.
- 26 tests, all CLAUDE.md edge cases covered. make test/lint/build all green.
What was left incomplete:
- Nothing in scope. UI begins at Agent 3.
Files created or modified:
- src/logic/{gates,binary,halfAdder,fullAdder,alu}.js (implemented)
- src/logic/{gates,binary,halfAdder,fullAdder,alu}.test.js (new)
- package.json (test scripts + vitest dep), Makefile (test target).
Patterns discovered:
- See "Logic layer API" section — the alu() column shape is purpose-built for
  the carry animation; Agent 6/3 should drive AdderColumn/ALUPage straight off
  `columns`, not recompute.
- MSB-first bit array convention is now locked across the project.
Gotchas hit:
- None significant. Vitest's default node environment is enough for pure logic;
  component testing will need jsdom setup later (noted in Gotchas).
Handoff notes for next agent (Agent 3 — Shared Components):
- Build all reusable components, NO page assembly. Components: SignalWire,
  GateSymbol, BitToggle, TruthTable, AdderColumn, CPULayer, EntryCard, PageNav.
- Use Framer Motion only where CLAUDE.md allows (SignalWire path draw,
  GateSymbol activation, AdderColumn carry hand-off, CPULayer expand, page fade).
- Use the `signal-on/off/carry` Tailwind colors. Decide the final carry color
  (open question in state.md) — carry currently seeded as amber #f59e0b.
- AdderColumn should render directly from one `alu()` column object
  ({ bit, a, b, carryIn, sum, carryOut }).
- If you add component tests, set up jsdom (see Gotchas) and keep lint green.

## Run 3 — Shared Components — 2026-06-19
Status: complete
What was done:
- Set up jsdom + @testing-library + jest-dom; vitest.config.js + src/test/setup.js.
- TDD-built all 8 shared components (red→green per group), no page assembly.
- 29 component tests added; 55 total. make test/lint/build all green.
- Resolved the SignalWire carry-color open question (amber signal-carry).
What was left incomplete:
- Components are not yet imported by any page (tree-shaken from the build until
  Agent 4+ wire them in). Direct component tests cover them.
Files created or modified:
- vitest.config.js, src/test/setup.js (new).
- src/components/{BitToggle,EntryCard,PageNav,SignalWire,GateSymbol,TruthTable,
  AdderColumn,CPULayer}.jsx (implemented) + matching .test.jsx (new).
- package.json (jsdom + testing-library devDeps).
Patterns discovered:
- See "Shared components API" + component-test conventions/gotchas above.
- Components expose data-* hooks for state; pages drive them with derived values
  (gate outputs, alu columns) — never duplicate logic in a component/page.
Gotchas hit:
- MemoryRouter vs HashRouter href format (now in Gotchas).
Handoff notes for next agent (Agent 4 — Entry + Numbers):
- Build EntryPage and NumbersPage only. EntryPage: two EntryCards (calculator
  "5 + 3 = ?" left, PostgreSQL "SELECT 5 + 3;" right); on select, set
  EntryContext via useEntry().setEntryPoint('calculator'|'postgresql') then
  navigate to /numbers. No back button on EntryPage (PageNav with no prev).
- NumbersPage: animate decimal 5 → 0101 and 3 → 0011, bits lighting up one by
  one (Framer Motion stagger). Use decimalToBinary(5)/(3) from logic/binary.js
  (MSB-first → [0,1,0,1], [0,0,1,1]) and BitToggle/SignalWire for the bit cells.
- Routes already exist in App.jsx. Use PageNav for next→/gates.
- Keep make test/lint/build green; add page-level tests where there's behavior
  (e.g. selecting an EntryCard stores the choice and routes onward).

## Run 4 — Entry + Numbers — 2026-06-19
Status: complete
What was done:
- EntryPage: two EntryCards; selecting sets EntryContext + navigates to /numbers;
  no back button. NumbersPage: staggered 5→0101 / 3→0011 bit animation using
  decimalToBinary, with PageNav onward to /gates. Both TDD'd.
- 8 new page tests; 63 total. make test/lint/build all green.
What was left incomplete:
- GatesPage, AdderPage, ALUPage, CPUPage, ResultPage still scaffold stubs.
Files created or modified:
- src/pages/EntryPage.jsx, src/pages/NumbersPage.jsx (implemented) +
  EntryPage.test.jsx, NumbersPage.test.jsx (new).
Patterns discovered:
- Page tests render inside EntryProvider + MemoryRouter with a probe route to
  assert context+navigation together (now in Gotchas).
- NumbersPage's lit/dim bit cell styling is the reusable visual for "a bit";
  later pages should match it (border-signal-on + glow for 1, slate for 0).
Gotchas hit:
- react/no-unescaped-entities on literal quotes in JSX prose (now in Gotchas).
## Run 5 — Gates + Adder — 2026-06-19
Status: complete
What was done:
- GatesPage: shared A/B BitToggle inputs feed AND/OR/XOR/NOT cards (GateSymbol +
  SignalWire + per-gate TruthTable). Outputs from logic/gates.js; live recompute.
- AdderPage: half adder (A=1,B=1, halfAdder.js) + full adder (toggleable
  carry_in, fullAdder.js) with carry-out arrow + plain-English label. TDD'd.
- 9 new page tests; 72 total. make test/lint/build all green.
Files created or modified:
- src/pages/GatesPage.jsx, src/pages/AdderPage.jsx (+ .test.jsx). 
Patterns discovered:
- Page-local presentational sub-components (GateCard, ValueCell, Section) live
  inside the page file — keep them small and under the 150-line/file rule. The
  8 shared components stay in src/components; page-specific bits do not.
- To target one of several BitToggles in a test, wrap it in a div with a
  data-testid and use testing-library `within(...).getByRole('button')`.
- Gate/adder outputs are DERIVED — only the raw inputs (a, b, carryIn) are in
  useState. Never store computed outputs.
Gotchas hit:
- None new.
Handoff notes for next agent (Agent 6 — ALU):
- Build ALUPage only. Fixed inputs A=0101 (5), B=0011 (3) — use
  decimalToBinary(5)/(3) then alu(bitsA, bitsB) from logic/alu.js. Render four
  AdderColumn components from `result.columns`, bit 0 on the RIGHT (columns are
  LSB-first, so reverse for display or order right-to-left).
- Two modes: Auto (click Run → columns animate left→right, carry travels between
  them, ~500ms/column) and Step (Next advances one column; user watches carry
  arrive and leave). Drive the "active column" with an index in useState; pass
  `active` to the matching AdderColumn. AdderColumn already renders all signals +
  a carry arrow from a column object — do not recompute adder logic.
- Overflow badge when result.overflow (carry exits bit 3). Result bar shows
  result.sumBits as binary and result.decimal below the columns.
- canProceed: require completing at least one full run before PageNav next→/cpu
  is enabled (use PageNav nextDisabled until a run finishes). TDD the state
  machine (step advances active column; full run sets canProceed/overflow).
- 500ms auto-speed is an open question in state.md — pick 500ms but make it a
  named constant so it is easy to tune; note your call in the session log.

## Run 8 — Polish + Deploy — 2026-06-19
Status: partial (polish complete; deploy blocked on human)
What was done:
- Responsive pass: ALUPage + CPUPage inline-ALU four-column rows wrapped in
  overflow-x-auto (mx-auto flex w-max) so they scroll on narrow screens. Other
  pages already fit mobile.
- Verified CLAUDE.md edge cases via the logic suite (all green) and confirmed the
  overflow badge is data-driven (result.overflow), not hardcoded to 5+3.
- Wrote README.md. Final: 91 tests + lint + build all green.
What was left incomplete:
- GitHub Pages deploy. The directory is NOT a git repo and has no remote/auth.
  Deferred to a human (see state.md "What needs a human right now"). Did not
  init git / create repo / push — outward credential-bearing action for the owner.
Files created or modified:
- src/pages/ALUPage.jsx, src/pages/CPUPage.jsx (responsive wrappers), README.md.
Patterns discovered:
- Multi-column animated rows: wrap in `overflow-x-auto` + inner `mx-auto flex
  w-max` so they center when they fit and scroll when they don't, never breaking
  the page on mobile.
Gotchas hit:
- `make deploy` is not runnable without a git repo + GitHub push auth; treat the
  live-Pages push as a human step, not an agent step.
Handoff notes:
- Pipeline build work is DONE. Remaining: a human creates/links the GitHub repo,
  authenticates, runs `make deploy`, and enables Pages on the gh-pages branch.
  After that, v1 is live. No further agent build work is queued.

## Run 7 — CPU + Result — 2026-06-19
Status: complete
What was done:
- CPUPage: four CPULayer cards open in sequence (unlock once prior is opened).
  Execute embeds an inline read-only mini ALU (alu(5,3) + AdderColumns). Next→
  /result gated until all four opened. ResultPage: branches on
  useEntry().entryPoint (calculator display / psql terminal / graceful null
  fallback) + a 7-layer stack summary. Both TDD'd. 11 tests; 91 total. Green.
Files created or modified:
- src/pages/CPUPage.jsx, src/pages/ResultPage.jsx (+ .test.jsx).
Patterns discovered:
- Sequence-gating with two arrays in useState: `open` (current) + `opened`
  (sticky ever-opened). unlock(i) = i===0 || opened[i-1]; canProceed =
  opened.every(Boolean). Closing a prior card does NOT re-lock later ones.
- Testing a context-branching page: provide the context value directly with
  `<EntryContext.Provider value={{ entryPoint, setEntryPoint(){} }}>` (import the
  default export) rather than going through EntryProvider — lets a test seed any
  entryPoint, including null for the deep-link/refresh fallback case.
- EntryContext is in-memory only: a refresh or deep link to a later page loses
  the choice. ResultPage handles null gracefully; Agent 8 may consider whether
  other pages need the same treatment (they currently don't depend on it).
Gotchas hit:
- None new.
Handoff notes for next agent (Agent 8 — Polish + Deploy, FINAL):
- Manually verify the edge cases in CLAUDE.md against the logic + ALUPage
  (0+0, 15+1, 7+8, 15+15, full-adder carry_in). The logic tests already cover
  these — confirm nothing in the UI assumes only the 5+3 case.
- Responsive/mobile pass: pages use max-w + flex/grid; check the ALU four-column
  row and gate grid on narrow screens (they may need to scroll or wrap). The
  500ms ALU STEP_MS can be revisited here if it reads too fast.
- Write README.md (what it is, make commands, deploy steps). 
- Deploy: vite base is '/logic-gate-visualizer/'. `make deploy` runs
  `vite build && npx gh-pages -d dist`. This needs the GitHub repo to exist and
  push auth — if it fails on credentials, write it under "What needs a human
  right now" in state.md and stop rather than guessing.
- Keep make test/lint/build green to the end.

## Run 6 — ALU — 2026-06-19
Status: complete
What was done:
- ALUPage: alu(5,3) → four AdderColumns (bit 0 right). Step mode advances the
  active column left as carry travels; Auto mode runs on a 500ms timer (named
  const STEP_MS); Reset clears. Result bar (1000 = 8), overflow badge when
  result.overflow. PageNav next→/cpu gated by everCompleted (nextDisabled).
- 8 page tests (incl. fake-timer auto-mode); 80 total. test/lint/build green.
- Resolved the 500ms open question (kept, as a tunable constant).
Files created or modified:
- src/pages/ALUPage.jsx (+ .test.jsx).
Patterns discovered:
- Animation "active step" state machine: an integer `current` (-1..N-1) in
  useState; Step bumps it, Auto bumps it on a timer effect, a second effect sets
  a sticky `everCompleted` when current hits the last index. Pass `active=
  (col.bit === current)` to each AdderColumn. canProceed = everCompleted.
- Fake-timer tests: advance tick-by-tick inside act() (loop of
  `act(() => vi.advanceTimersByTime(STEP_MS))`), NOT one big advance — chained
  setTimeout→setState→new-effect won't fully flush in a single advance under
  React 18. Restore with vi.useRealTimers() in afterEach.
- Display order vs logic order: alu().columns is LSB-first; reverse a copy
  (`[...columns].reverse()`) to show MSB left / bit 0 right. Never mutate.
Gotchas hit:
- The fake-timer flush issue above (now documented).
Handoff notes for next agent (Agent 7 — CPU + Result, the FINAL pages):
- Build CPUPage and ResultPage; wire EntryContext into ResultPage.
- CPUPage: four CPULayer cards (Fetch, Decode, Execute, Writeback) that open in
  sequence — card N only opens after N-1 is open. Drive with an `openCount` /
  per-card open state in useState; pass `locked` to CPULayer for cards beyond the
  next allowed one (CPULayer already blocks opening when locked). Execute card
  embeds an INLINE read-only mini ALU (reuse alu(5,3) + AdderColumn, no controls,
  not a link). Decode shows registers loading 5 and 3; Writeback shows result 8
  landing. PageNav next→/result, gate it until all four have been opened.
- ResultPage: read useEntry().entryPoint. 'calculator' → animated display
  lighting up "8" + caption "This is what happened inside when you pressed =".
  'postgresql' → terminal "?column?\n--------\n8" + caption about the query.
  If entryPoint is null (deep link / refresh — context is in-memory only and
  resets), show a sensible default or a prompt to start from EntryPage; do not
  crash. Both endings then show the full layer-stack summary diagram.
- TDD both: CPU sequence-gating state machine; ResultPage branch by entryPoint
  (render inside EntryProvider + set the value, or wrap with a provider that
  seeds it). Keep test/lint/build green; watch react/no-unescaped-entities.

Handoff notes for prior agent (Agent 5 — Gates + Adder):
- Build GatesPage and AdderPage only.
- GatesPage: four gate cards (AND, OR, XOR, NOT) using GateSymbol + SignalWire +
  BitToggle; toggling an input visibly travels the signal, lights the gate, and
  carries the output. Compute outputs from logic/gates.js (NEVER inline gate
  logic). TruthTable highlights the active row (pass `active={[a,b]}`). Give XOR
  a visual accent (GateSymbol already brightens XOR).
- AdderPage: Section 1 half adder (A=1,B=1 from 5+3 bit 0) using halfAdder.js —
  XOR→sum, AND→carry, animate both. Section 2 full adder using fullAdder.js with
  a carry_in wire in signal-carry color; carry_out exits left with an arrow and a
  plain-English label. Do not recompute adder logic in the page.
- Derive everything (no gate/adder outputs in useState). Keep test/lint/build
  green; watch react/no-unescaped-entities in prose.
