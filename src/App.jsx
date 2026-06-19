import { createHashRouter, RouterProvider } from 'react-router-dom'
import { EntryProvider } from './context/EntryContext.jsx'
import EntryPage from './pages/EntryPage.jsx'
import NumbersPage from './pages/NumbersPage.jsx'
import GatesPage from './pages/GatesPage.jsx'
import AdderPage from './pages/AdderPage.jsx'
import ALUPage from './pages/ALUPage.jsx'
import CPUPage from './pages/CPUPage.jsx'
import ResultPage from './pages/ResultPage.jsx'

// Hash router is REQUIRED for GitHub Pages (no server-side routing).
const router = createHashRouter([
  { path: '/', element: <EntryPage /> },
  { path: '/numbers', element: <NumbersPage /> },
  { path: '/gates', element: <GatesPage /> },
  { path: '/adder', element: <AdderPage /> },
  { path: '/alu', element: <ALUPage /> },
  { path: '/cpu', element: <CPUPage /> },
  { path: '/result', element: <ResultPage /> },
])

export default function App() {
  return (
    <EntryProvider>
      <RouterProvider router={router} />
    </EntryProvider>
  )
}
