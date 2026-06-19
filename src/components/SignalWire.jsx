import { motion } from 'framer-motion'

// Animated wire carrying a single bit. When `active`, the signal visibly
// travels along the wire via strokeDashoffset (Framer Motion). Carry wires use
// the carry color so the user can see carry moving between adder columns.
//
// value: 0 | 1, active?: boolean, carry?: boolean, vertical?: boolean
export default function SignalWire({ value, active = false, carry = false, vertical = false, length = 80 }) {
  const on = value === 1
  const color = carry ? '#f59e0b' : on ? '#22d3ee' : '#475569'
  const x2 = vertical ? 2 : length
  const y2 = vertical ? length : 2

  return (
    <svg
      data-testid="signal-wire"
      data-value={value}
      data-active={active ? 'true' : 'false'}
      data-carry={carry ? 'true' : 'false'}
      role="img"
      aria-label={`${carry ? 'carry ' : ''}signal carrying ${value}`}
      width={vertical ? 4 : length}
      height={vertical ? length : 4}
      className="overflow-visible"
    >
      {/* dim track */}
      <line x1="2" y1="2" x2={x2} y2={y2} stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      {/* energized signal — animates in when active */}
      <motion.line
        x1="2"
        y1="2"
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : on ? 1 : 0, opacity: on || active ? 1 : 0.3 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </svg>
  )
}
