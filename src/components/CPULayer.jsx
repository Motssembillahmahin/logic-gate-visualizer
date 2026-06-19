import { AnimatePresence, motion } from 'framer-motion'

// One CPU-cycle stage card. Cards open in sequence: a locked card cannot be
// opened (enforces the learning order). Body expands when isOpen.
//
// title, isOpen, locked?, onToggle, step?, children
export default function CPULayer({ title, isOpen, locked = false, onToggle, step, children }) {
  return (
    <div
      data-testid="cpu-layer"
      data-open={isOpen ? 'true' : 'false'}
      data-locked={locked ? 'true' : 'false'}
      className={`overflow-hidden rounded-lg border ${
        isOpen ? 'border-signal-on' : 'border-slate-700'
      } bg-slate-800/50`}
    >
      <button
        type="button"
        disabled={locked}
        onClick={locked ? undefined : onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-100">
          {step != null && <span className="text-signal-on">{step}.</span>}
          {title}
        </span>
        <span className="text-slate-400">{locked ? '🔒' : isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-slate-700 px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
