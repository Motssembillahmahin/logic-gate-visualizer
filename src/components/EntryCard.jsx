import { motion } from 'framer-motion'

// Entry option card (calculator or PostgreSQL). The whole card is the button.
// title, description, onSelect: () => void, accent?: string, children?: ReactNode
export default function EntryCard({ title, description, onSelect, accent = 'signal-on', children }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={[
        'flex w-full max-w-sm flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800/60 p-6 text-left',
        'transition-colors hover:border-' + accent,
      ].join(' ')}
    >
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <p className="font-mono text-sm text-slate-300">{description}</p>
      {children}
    </motion.button>
  )
}
