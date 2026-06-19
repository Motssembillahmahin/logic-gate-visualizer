import { motion } from 'framer-motion'

// Clickable bit button. Lights up when the bit is 1 (signal-on), dim when 0.
// value: 0 | 1, onToggle: () => void, disabled?: boolean, label?: string
export default function BitToggle({ value, onToggle, disabled = false, label }) {
  const on = value === 1
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        type="button"
        aria-pressed={on}
        disabled={disabled}
        onClick={disabled ? undefined : onToggle}
        animate={{ scale: on ? 1.05 : 1 }}
        transition={{ duration: 0.15 }}
        className={[
          'h-12 w-12 rounded-md border font-mono text-xl font-bold tabular-nums',
          'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          on
            ? 'border-signal-on bg-signal-on/20 text-signal-on shadow-[0_0_12px] shadow-signal-on/40'
            : 'border-signal-off bg-slate-800 text-slate-400',
        ].join(' ')}
      >
        {value}
      </motion.button>
      {label && <span className="text-xs text-slate-400">{label}</span>}
    </div>
  )
}
