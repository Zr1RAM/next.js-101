"use client"; // error boundaries must be Client Components
import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 console.error(error);
 }, [error]);
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50 mx-4 my-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-red-800 dark:text-red-400 mb-4">Something went wrong!</h2>
      <p className="text-red-600 dark:text-red-300 mb-6 bg-red-100 dark:bg-red-900/50 p-4 rounded-md font-mono text-sm max-w-lg overflow-auto border border-red-200 dark:border-red-900/50">
        {error.message}
      </p>
      <button 
        onClick={() => reset()} // Next.js automatically passes a reset function as a prop to your Error component. you dont need to pass anything
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md transition-all duration-200 font-medium shadow-sm hover:shadow-md"
      >
        Try again
      </button>
    </div>
  );
}
