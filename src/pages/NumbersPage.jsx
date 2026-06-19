import { motion } from 'framer-motion'
import { decimalToBinary } from '../logic/binary.js'
import PageNav from '../components/PageNav.jsx'

// Bits light up one by one (Framer Motion stagger). This page sets the visual
// language of "a bit" that every later page reuses.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
}
const cell = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1 },
}

function BinaryRow({ decimal }) {
  const bits = decimalToBinary(decimal)
  return (
    <div className="flex items-center gap-5">
      <span className="w-10 text-right font-mono text-3xl font-bold text-slate-100">{decimal}</span>
      <span className="text-slate-500">→</span>
      <motion.div
        data-testid={`binary-${decimal}`}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-2"
      >
        {bits.map((bit, i) => (
          <motion.span
            key={i}
            data-bit-cell
            variants={cell}
            className={[
              'flex h-12 w-12 items-center justify-center rounded-md border font-mono text-xl font-bold',
              bit === 1
                ? 'border-signal-on bg-signal-on/20 text-signal-on shadow-[0_0_12px] shadow-signal-on/40'
                : 'border-signal-off bg-slate-800 text-slate-400',
            ].join(' ')}
          >
            {bit}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default function NumbersPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-100">First, the numbers become bits</h1>
        <p className="mt-2 text-slate-400">
          The machine does not know the digits 5 or 3. It knows wires that are on (1) or off (0).
          Here is 5 and 3 in four bits each.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <BinaryRow decimal={5} />
        <BinaryRow decimal={3} />
      </div>

      <p className="mt-8 font-mono text-sm text-slate-500">
        5 = 0101, &nbsp; 3 = 0011 &nbsp;— each lit cell is a wire carrying a 1.
      </p>

      <PageNav prev={{ to: '/', label: 'Entry' }} next={{ to: '/gates', label: 'Gates' }} />
    </main>
  )
}
