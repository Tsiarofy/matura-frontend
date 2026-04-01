import { useState } from 'react'
function App() {
  const [count, setCount] = useState(0)

  return (
 
      <div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button >
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-red-500 font-bold">
          Click on the Vite and React logos to learn more
        </p>
      </div>

  )
}

export default App
