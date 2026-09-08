
const SSGExample = ({slug}: {slug: string}) => {
    return (
        <div>
            <h1>SSG Example: {slug}</h1>
            <p className="mt-2 text-zinc-400">
                This page is rendered at build time. The content will be the same for every request
            </p>
        </div>
    )
}

export default SSGExample