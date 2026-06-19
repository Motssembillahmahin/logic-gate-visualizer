import { useState } from 'react'
import { and, or, xor, not } from '../logic/gates.js'
import GateSymbol from '../components/GateSymbol.jsx'
import SignalWire from '../components/SignalWire.jsx'
import BitToggle from '../components/BitToggle.jsx'
import TruthTable from '../components/TruthTable.jsx'
import PageNav from '../components/PageNav.jsx'

const ROWS = {
  AND: [0, 0, 0, 1],
  OR: [0, 1, 1, 1],
  XOR: [0, 1, 1, 0],
}
const twoInputRows = (type) =>
  [[0, 0], [0, 1], [1, 0], [1, 1]].map((inp, i) => ({ in: inp, out: ROWS[type][i] }))

function OutputCell({ type, value }) {
  const on = value === 1
  return (
    <span
      data-testid={`output-${type}`}
      className={`flex h-9 w-9 items-center justify-center rounded border font-mono font-bold ${
        on ? 'border-signal-on text-signal-on' : 'border-slate-600 text-slate-400'
      }`}
    >
      {value}
    </span>
  )
}

function GateCard({ type, inputs, output, rows, active }) {
  return (
    <div data-testid={`gate-card-${type}`} className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2">
          {inputs.map((v, i) => (
            <SignalWire key={i} value={v} active={v === 1} length={40} />
          ))}
        </div>
        <GateSymbol type={type} active={output === 1} />
        <SignalWire value={output} active={output === 1} length={40} />
        <OutputCell type={type} value={output} />
      </div>
      <TruthTable
        inputs={inputs.length === 1 ? ['A'] : ['A', 'B']}
        outputLabel={type}
        rows={rows}
        active={active}
      />
    </div>
  )
}

export default function GatesPage() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">The gates that decide everything</h1>
        <p className="mt-2 text-slate-400">
          Flip the inputs and watch each gate react. XOR is the one to watch — it is how addition
          begins.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-6">
        <span className="text-sm text-slate-400">Inputs:</span>
        <div data-testid="input-A">
          <BitToggle value={a} onToggle={() => setA((v) => not(v))} label="A" />
        </div>
        <div data-testid="input-B">
          <BitToggle value={b} onToggle={() => setB((v) => not(v))} label="B" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <GateCard type="AND" inputs={[a, b]} output={and(a, b)} rows={twoInputRows('AND')} active={[a, b]} />
        <GateCard type="OR" inputs={[a, b]} output={or(a, b)} rows={twoInputRows('OR')} active={[a, b]} />
        <GateCard type="XOR" inputs={[a, b]} output={xor(a, b)} rows={twoInputRows('XOR')} active={[a, b]} />
        <GateCard
          type="NOT"
          inputs={[a]}
          output={not(a)}
          rows={[{ in: [0], out: 1 }, { in: [1], out: 0 }]}
          active={[a]}
        />
      </div>

      <PageNav prev={{ to: '/numbers', label: 'Numbers' }} next={{ to: '/adder', label: 'Adder' }} />
    </main>
  )
}
