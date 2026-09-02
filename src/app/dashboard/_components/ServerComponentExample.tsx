import DogList from "./(Dog)/DogList";

const ServerComponentExample = async () => {
    let res: Response;
    try {
        // Next JS will cache data for 5 minutes by default. This is called static caching.
        res = await fetch("https://dogapi.dog/api/v2/breeds", {
            next: {
                revalidate: 300
            }
        });
    }
    catch (error) {
        throw new Error(
            `Network connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
    if (!res.ok) {
        throw new Error(`Failed to fetch data: Received status code ${res.status}`);
    }
    // Next JS cache options
    // cache: "force-cache" - Next JS will cache data for 5 minutes by default. This is called static caching.
    // cache: "no-store" - Next JS will not cache data. This is called dynamic caching.
    // cache: "no-cache" - Next JS will not cache data. This is called dynamic caching.
    // const res2 = await fetch("https://dogapi.dog/api/v2/breeds", { cache: "force-cache" });
    // const res3 = await fetch("https://dogapi.dog/api/v2/breeds", { next: { revalidate: 60 } });
    const data = await res.json();
    return (
        <DogList dogs={data.data} limit={10} />
    )
}

export default ServerComponentExample