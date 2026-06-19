import { motion } from 'framer-motion'

// One full-adder column, rendered straight from an alu() column object:
// { bit, a, b, carryIn, sum, carryOut }. `active` highlights the column while
// it is computing; carryOut animates an arrow leftward into the next column.
function Chip({ testid, label, value, carry = false }) {
  const on = value === 1
  const color = carry ? 'text-signal-carry border-signal-carry' : on ? 'text-signal-on border-signal-on' : 'text-slate-400 border-slate-600'
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-right text-xs text-slate-400">{label}</span>
      <span
        data-testid={testid}
        className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-sm font-bold ${color}`}
      >
        {value}
      </span>
    </div>
  )
}

export default function AdderColumn({ column, active = false }) {
  const { bit, a, b, carryIn, sum, carryOut } = column
  return (
    <motion.div
      data-testid="adder-column"
      data-bit={bit}
      data-active={active ? 'true' : 'false'}
      animate={{ borderColor: active ? '#22d3ee' : '#334155' }}
      className="relative flex flex-col gap-1.5 rounded-lg border-2 bg-slate-800/50 p-3"
    >
      <div className="mb-1 text-center text-xs font-semibold text-slate-300">bit {bit}</div>
      <Chip testid="col-a" label="A" value={a} />
      <Chip testid="col-b" label="B" value={b} />
      <Chip testid="col-carry-in" label="carry in" value={carryIn} carry />
      <div className="my-1 border-t border-slate-700" />
      <Chip testid="col-sum" label="sum" value={sum} />
      <Chip testid="col-carry-out" label="carry out" value={carryOut} carry />
      {carryOut === 1 && (
        <motion.div
          aria-hidden
          className="absolute -left-3 top-1/2 text-signal-carry"
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: active ? 1 : 0.4, x: 0 }}
        >
          ←
        </motion.div>
      )}
    </motion.div>
  )
}
