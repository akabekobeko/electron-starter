import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const versions = window.electronAPI?.versions

  return (
    <div className="container">
      <h1>Electron + Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
      </div>
      {versions && (
        <div className="versions">
          <p>Electron: {versions.electron}</p>
          <p>Chrome: {versions.chrome}</p>
          <p>Node: {versions.node}</p>
        </div>
      )}
    </div>
  )
}

export default App
