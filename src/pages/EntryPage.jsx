import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEntry } from '../context/EntryContext.jsx'
import EntryCard from '../components/EntryCard.jsx'

// Page 1 — pick an entry point. The choice is the app's only global state.
// Both paths converge after this; only ResultPage differs at the end.
export default function EntryPage() {
  const navigate = useNavigate()
  const { setEntryPoint } = useEntry()

  const choose = (point) => {
    setEntryPoint(point)
    navigate('/numbers')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-10 p-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-100">What happens inside the machine?</h1>
        <p className="mt-2 text-slate-400">
          Pick how you meet <span className="font-mono text-signal-on">5 + 3</span>. Same silicon,
          two ways in.
        </p>
      </motion.div>

      <div className="flex w-full flex-col items-stretch justify-center gap-6 sm:flex-row">
        <EntryCard
          title="Calculator"
          description="5 + 3 = ?"
          accent="signal-on"
          onSelect={() => choose('calculator')}
        >
          <span className="text-xs text-slate-400">For HSC students — the keys you have always pressed.</span>
        </EntryCard>

        <EntryCard
          title="PostgreSQL"
          description="SELECT 5 + 3;"
          accent="signal-on"
          onSelect={() => choose('postgresql')}
        >
          <span className="text-xs text-slate-400">For developers — the query that bottoms out at gates.</span>
        </EntryCard>
      </div>
    </main>
  )
}
