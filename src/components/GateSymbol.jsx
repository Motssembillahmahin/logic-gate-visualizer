import { motion } from 'framer-motion'

// SVG logic-gate symbol that lights up when active. XOR gets a brighter accent
// because it is the key gate for addition.
//
// type: 'AND' | 'OR' | 'XOR' | 'NOT', active: boolean
const ACCENT = {
  XOR: '#22d3ee',
  AND: '#38bdf8',
  OR: '#38bdf8',
  NOT: '#38bdf8',
}

export default function GateSymbol({ type, active }) {
  const accent = ACCENT[type] ?? '#38bdf8'
  return (
    <motion.div
      data-testid="gate-symbol"
      data-type={type}
      data-active={active ? 'true' : 'false'}
      animate={{
        borderColor: active ? accent : '#475569',
        boxShadow: active ? `0 0 16px ${accent}66` : '0 0 0px transparent',
      }}
      transition={{ duration: 0.25 }}
      className="flex h-16 w-20 items-center justify-center rounded-lg border-2 bg-slate-800"
    >
      <motion.span
        animate={{ color: active ? accent : '#94a3b8' }}
        transition={{ duration: 0.25 }}
        className={[
          'font-mono font-bold',
          type === 'XOR' ? 'text-lg tracking-wide' : 'text-base',
        ].join(' ')}
      >
        {type}
      </motion.span>
    </motion.div>
  )
}
