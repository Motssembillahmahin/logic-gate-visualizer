import { createContext, useContext, useState } from 'react'

// The ONLY global state in the app.
// Set once on EntryPage, read by ResultPage to decide the ending.
// value: 'calculator' | 'postgresql' | null
const EntryContext = createContext(null)

export function EntryProvider({ children }) {
  const [entryPoint, setEntryPoint] = useState(null)
  return (
    <EntryContext.Provider value={{ entryPoint, setEntryPoint }}>
      {children}
    </EntryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEntry() {
  return useContext(EntryContext)
}

export default EntryContext
