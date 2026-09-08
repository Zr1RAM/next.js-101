async function SuspenseExample() {
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate delay
  return (
    <div>
        <h2 className="font-bold text-lg mb-4">Suspense Example</h2>
        <p className="text-zinc-500 dark:text-zinc-400">This is a suspense example, it should load after a suspense boundary/message is triggered.</p>
        {/* Show some data after suspense boundary/message is triggered. */}
        <div className="flex gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg">
                <h3 className="font-bold">Item 1</h3>
                <p>Item 1</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg">
                <h3 className="font-bold">Item 2</h3>
                <p>Item 2</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg">
                <h3 className="font-bold">Item 3</h3>
                <p>Item 3</p>
            </div>
        </div>
    </div>
  )
}

export default SuspenseExample