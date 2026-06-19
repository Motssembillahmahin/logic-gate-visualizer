import { useState } from 'react'
import { motion } from 'framer-motion'
import { halfAdder } from '../logic/halfAdder.js'
import { fullAdder } from '../logic/fullAdder.js'
import { not } from '../logic/gates.js'
import SignalWire from '../components/SignalWire.jsx'
import BitToggle from '../components/BitToggle.jsx'
import PageNav from '../components/PageNav.jsx'

function ValueCell({ testid, label, value, carry = false }) {
  const on = value === 1
  const color = carry ? 'border-signal-carry text-signal-carry' : on ? 'border-signal-on text-signal-on' : 'border-slate-600 text-slate-400'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <span data-testid={testid} className={`flex h-8 w-8 items-center justify-center rounded border font-mono font-bold ${color}`}>
        {value}
      </span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  )
}

export default function AdderPage() {
  // Half adder: fixed inputs from 5+3, bit 0 (1 + 1).
  const ha = halfAdder(1, 1)
  // Full adder: same A,B with a toggleable carry_in.
  const [carryIn, setCarryIn] = useState(0)
  const fa = fullAdder(1, 1, carryIn)

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Adding two bits</h1>
        <p className="mt-2 text-slate-400">
          A half adder adds two bits. A full adder also accepts a carry coming in from the column to
          its right.
        </p>
      </header>

      <Section title="Half adder — A = 1, B = 1">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <ValueCell testid="ha-a" label="A" value={1} />
            <ValueCell testid="ha-b" label="B" value={1} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SignalWire value={ha.sum} active={ha.sum === 1} length={50} />
              <ValueCell testid="ha-sum" label="sum (XOR)" value={ha.sum} />
            </div>
            <div className="flex items-center gap-2">
              <SignalWire value={ha.carry} active={ha.carry === 1} carry length={50} />
              <ValueCell testid="ha-carry" label="carry (AND)" value={ha.carry} carry />
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">1 + 1 = 0 with a carry of 1 — the sum bit is 0, the carry is 1.</p>
      </Section>

      <Section title="Full adder — A = 1, B = 1, with carry in">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <ValueCell testid="fa-a" label="A" value={1} />
            <ValueCell testid="fa-b" label="B" value={1} />
            <div data-testid="carry-in-toggle" className="flex items-center gap-2">
              <span className="text-xs text-signal-carry">carry in</span>
              <BitToggle value={carryIn} onToggle={() => setCarryIn((v) => not(v))} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SignalWire value={fa.sum} active={fa.sum === 1} length={50} />
              <ValueCell testid="fa-sum" label="sum" value={fa.sum} />
            </div>
            <div className="flex items-center gap-2">
              <motion.span aria-hidden className="text-signal-carry" animate={{ x: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                ←
              </motion.span>
              <SignalWire value={fa.carryOut} active={fa.carryOut === 1} carry length={50} />
              <ValueCell testid="fa-carry-out" label="carry out" value={fa.carryOut} carry />
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-signal-carry">carry_out moves to the next column on the left.</p>
      </Section>

      <PageNav prev={{ to: '/gates', label: 'Gates' }} next={{ to: '/alu', label: 'ALU' }} />
    </main>
  )
}
