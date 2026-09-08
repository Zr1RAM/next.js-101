"use client"
import { useState, Suspense } from "react"
import { CatImage } from "./(Animals)/CatImage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingSpinner from "./(Suspense)/SuspenseLoader";

export function Counter() {
  const [count, setCount] = useState(0);
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
  );
}

const ClientComponentExample = () => {
  // Create a local query client instance for this subtree
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Counter />
      <br />
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingSpinner />}>
          <CatImage />
        </Suspense>
      </QueryClientProvider>
    </>
  )
}

export default ClientComponentExample