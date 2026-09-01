import DogList from "./(Dog)/DogList";

const ServerComponentExample = async () => {
    const res = await fetch("https://dogapi.dog/api/v2/breeds");
    const data = await res.json();
    return (
        <DogList dogs={data.data} limit={10} />
    )
}

export default ServerComponentExample