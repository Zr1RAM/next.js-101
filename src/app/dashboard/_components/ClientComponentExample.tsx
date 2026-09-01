"use client"
import { useState } from "react"

const ClientComponentExample = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-full"
        onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default ClientComponentExample