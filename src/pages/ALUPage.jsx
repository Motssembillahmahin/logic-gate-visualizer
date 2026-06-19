import { useEffect, useState } from 'react'
import { decimalToBinary } from '../logic/binary.js'
import { alu } from '../logic/alu.js'
import AdderColumn from '../components/AdderColumn.jsx'
import PageNav from '../components/PageNav.jsx'

// Auto-mode pace. Tunable — see state.md open question on whether 500ms reads
// too fast; kept as a named constant so it is easy to adjust.
const STEP_MS = 500

// Fixed inputs for v1: A = 0101 (5), B = 0011 (3).
const result = alu(decimalToBinary(5), decimalToBinary(3))

export default function ALUPage() {
  const [current, setCurrent] = useState(-1) // active bit-column, -1 = none yet
  const [running, setRunning] = useState(false)
  const [everCompleted, setEverCompleted] = useState(false)

  // Auto mode: advance one column every STEP_MS until the carry exits bit 3.
  useEffect(() => {
    if (!running) return undefined
    if (current >= 3) {
      setRunning(false)
      return undefined
    }
    const t = setTimeout(() => setCurrent((c) => c + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [running, current])

  // A run is "complete" once the most significant column has been reached.
  useEffect(() => {
    if (current >= 3) setEverCompleted(true)
  }, [current])

  const handleStep = () => {
    setRunning(false)
    setCurrent((c) => Math.min(c + 1, 3))
  }
  const handleRun = () => {
    setCurrent(0)
    setRunning(true)
  }
  const handleReset = () => {
    setRunning(false)
    setCurrent(-1)
  }

  // Display MSB (bit 3) on the left, LSB (bit 0) on the right.
  const displayColumns = [...result.columns].reverse()

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">The ALU adds all four bits at once</h1>
        <p className="mt-2 text-slate-400">
          5 (0101) + 3 (0011). Watch the carry travel left, column by column. Bit 0 is on the right.
        </p>
      </header>

      <div className="overflow-x-auto pb-2">
        <div className="mx-auto flex w-max items-stretch gap-3">
          {displayColumns.map((col) => (
            <AdderColumn key={col.bit} column={col} active={col.bit === current} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={handleStep} className="rounded-md border border-signal-on px-4 py-2 text-sm text-signal-on hover:bg-signal-on/10">
          Step ▶
        </button>
        <button type="button" onClick={handleRun} className="rounded-md border border-slate-500 px-4 py-2 text-sm text-slate-200 hover:border-slate-300">
          Run (auto) ▶▶
        </button>
        <button type="button" onClick={handleReset} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:text-slate-200">
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <span className="text-slate-400">Result:</span>
        <span data-testid="result-binary" className="font-mono text-2xl font-bold text-signal-on">
          {result.sumBits.join('')}
        </span>
        <span className="text-slate-500">=</span>
        <span data-testid="result-decimal" className="font-mono text-2xl font-bold text-slate-100">
          {result.decimal}
        </span>
        {result.overflow && (
          <span data-testid="overflow-badge" className="rounded bg-signal-carry/20 px-2 py-1 text-sm font-semibold text-signal-carry">
            overflow — carry exited bit 3
          </span>
        )}
      </div>

      <PageNav
        prev={{ to: '/adder', label: 'Adder' }}
        next={{ to: '/cpu', label: 'CPU' }}
        nextDisabled={!everCompleted}
      />
    </main>
  )
}
