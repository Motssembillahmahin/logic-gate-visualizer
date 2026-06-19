import { useState } from 'react'
import { decimalToBinary } from '../logic/binary.js'
import { alu } from '../logic/alu.js'
import CPULayer from '../components/CPULayer.jsx'
import AdderColumn from '../components/AdderColumn.jsx'
import PageNav from '../components/PageNav.jsx'

const result = alu(decimalToBinary(5), decimalToBinary(3))
const displayColumns = [...result.columns].reverse()

function InlineALU() {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">
        The ALU fires — the same gates you just stepped through, now inside the cycle:
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="mx-auto flex w-max items-stretch gap-2">
          {displayColumns.map((col) => (
            <AdderColumn key={col.bit} column={col} active />
          ))}
        </div>
      </div>
    </div>
  )
}

const STAGES = [
  {
    title: 'Fetch',
    body: (
      <p className="text-sm text-slate-300">
        The ADD instruction is pulled from memory. The address bus lights up and the instruction
        arrives at the control unit.
      </p>
    ),
  },
  {
    title: 'Decode',
    body: (
      <p className="text-sm text-slate-300">
        The control unit reads the opcode. Operands 5 and 3 load into registers —{' '}
        <span className="font-mono text-signal-on">R1 = 0101</span>,{' '}
        <span className="font-mono text-signal-on">R2 = 0011</span>.
      </p>
    ),
  },
  { title: 'Execute', body: <InlineALU /> },
  {
    title: 'Writeback',
    body: (
      <p className="text-sm text-slate-300">
        The result <span className="font-mono text-signal-on">1000 = 8</span> lands in the
        destination register and its memory address lights up. The cycle is complete.
      </p>
    ),
  },
]

export default function CPUPage() {
  const [open, setOpen] = useState([false, false, false, false])
  const [opened, setOpened] = useState([false, false, false, false])

  // A stage can be opened only once the previous one has been opened (sequence).
  const unlocked = (i) => i === 0 || opened[i - 1]

  const toggle = (i) => {
    if (!unlocked(i)) return
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
    setOpened((prev) => (prev[i] ? prev : prev.map((v, idx) => (idx === i ? true : v))))
  }

  const canProceed = opened.every(Boolean)

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 p-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold text-slate-100">One CPU cycle, start to finish</h1>
        <p className="mt-2 text-slate-400">
          Open each stage in order. The ALU you just watched lives inside Execute.
        </p>
      </header>

      {STAGES.map((stage, i) => (
        <CPULayer
          key={stage.title}
          title={stage.title}
          step={i + 1}
          isOpen={open[i]}
          locked={!unlocked(i)}
          onToggle={() => toggle(i)}
        >
          {stage.body}
        </CPULayer>
      ))}

      <PageNav
        prev={{ to: '/alu', label: 'ALU' }}
        next={{ to: '/result', label: 'Result' }}
        nextDisabled={!canProceed}
      />
    </main>
  )
}
