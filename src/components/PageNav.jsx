import { Link } from 'react-router-dom'

// Previous / next navigation. prev and next are { to, label } or null/undefined.
// When nextDisabled is true, Next renders as a disabled button (e.g. ALUPage
// gates Next until the user completes a run).
export default function PageNav({ prev, next, nextDisabled = false }) {
  return (
    <nav className="mt-10 flex items-center justify-between gap-4">
      <div>
        {prev && (
          <Link
            to={prev.to}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-400 hover:text-slate-100"
          >
            ← Previous: {prev.label}
          </Link>
        )}
      </div>
      <div>
        {next &&
          (nextDisabled ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-500 opacity-50"
            >
              Next: {next.label} →
            </button>
          ) : (
            <Link
              to={next.to}
              className="rounded-md border border-signal-on px-4 py-2 text-sm font-medium text-signal-on transition-colors hover:bg-signal-on/10"
            >
              Next: {next.label} →
            </Link>
          ))}
      </div>
    </nav>
  )
}
