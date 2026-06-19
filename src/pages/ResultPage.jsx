import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEntry } from '../context/EntryContext.jsx'
import PageNav from '../components/PageNav.jsx'

const LAYERS = [
  'Entry point — calculator or PostgreSQL',
  'Numbers become binary — 5 = 0101, 3 = 0011',
  'Gates — AND, OR, XOR, NOT',
  'Adders — half adder, then full adder with carry',
  'ALU — four full adders, carry travels left',
  'CPU cycle — fetch, decode, execute, writeback',
  'Result — 8 surfaces back to your world',
]

function LayerSummary() {
  return (
    <div data-testid="layer-summary" className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-100">The full stack 5 + 3 travelled</h2>
      <ol className="flex flex-col gap-1.5 text-sm text-slate-300">
        {LAYERS.map((layer, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-signal-on">{i + 1}.</span>
            {layer}
          </li>
        ))}
      </ol>
    </div>
  )
}

function CalculatorEnding() {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        data-testid="result-calculator"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-24 w-48 items-center justify-end rounded-lg border-2 border-signal-on bg-slate-900 px-4 font-mono text-5xl font-bold text-signal-on shadow-[0_0_24px] shadow-signal-on/40"
      >
        8
      </motion.div>
      <p className="text-slate-400">This is what happened inside when you pressed =.</p>
    </div>
  )
}

function PostgresEnding() {
  return (
    <div className="flex flex-col items-center gap-3">
      <pre
        data-testid="result-postgresql"
        className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-left font-mono text-sm text-green-300"
      >
        {' ?column?\n----------\n        8\n(1 row)'}
      </pre>
      <p className="text-slate-400">This is what happened inside when PostgreSQL ran your query.</p>
    </div>
  )
}

function Fallback() {
  return (
    <div data-testid="result-fallback" className="flex flex-col items-center gap-3">
      <p className="text-slate-300">Pick an entry point to watch 5 + 3 travel through the machine.</p>
      <Link to="/" className="rounded-md border border-signal-on px-4 py-2 text-sm text-signal-on hover:bg-signal-on/10">
        Start from the beginning →
      </Link>
    </div>
  )
}

export default function ResultPage() {
  const { entryPoint } = useEntry()

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">8.</h1>
        <p className="mt-2 text-slate-400">Same silicon, whichever way you came in.</p>
      </header>

      {entryPoint === 'calculator' && <CalculatorEnding />}
      {entryPoint === 'postgresql' && <PostgresEnding />}
      {entryPoint !== 'calculator' && entryPoint !== 'postgresql' && <Fallback />}

      {(entryPoint === 'calculator' || entryPoint === 'postgresql') && <LayerSummary />}

      <PageNav prev={{ to: '/cpu', label: 'CPU' }} />
    </main>
  )
}
