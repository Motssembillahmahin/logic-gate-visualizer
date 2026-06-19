// Truth table that highlights the row matching the current inputs in real time.
// inputs: string[] column labels, outputLabel: string, active: number[],
// rows: { in: number[], out: number }[]
const matches = (rowIn, active) =>
  active && rowIn.length === active.length && rowIn.every((v, i) => v === active[i])

export default function TruthTable({ inputs, outputLabel, rows, active }) {
  return (
    <table className="border-collapse text-center font-mono text-sm">
      <thead>
        <tr className="text-slate-400">
          {inputs.map((label) => (
            <th key={label} className="border border-slate-700 px-3 py-1.5 font-semibold">
              {label}
            </th>
          ))}
          <th className="border border-slate-700 px-3 py-1.5 font-semibold text-signal-on">
            {outputLabel}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const isActive = matches(row.in, active)
          return (
            <tr
              key={idx}
              data-testid="truth-row"
              data-active={isActive ? 'true' : 'false'}
              className={isActive ? 'bg-signal-on/15 text-signal-on' : 'text-slate-300'}
            >
              {row.in.map((v, i) => (
                <td key={i} className="border border-slate-700 px-3 py-1.5">
                  {v}
                </td>
              ))}
              <td className="border border-slate-700 px-3 py-1.5 font-bold">{row.out}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
