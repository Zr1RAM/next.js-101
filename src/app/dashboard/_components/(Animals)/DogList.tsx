// app/dashboard/_components/DogList.tsx
import DogCard from "./DogCard";

interface DogApiResponse {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    images: {
      url: string;
    }[];
  };
}

interface DogListProps {
  dogs: DogApiResponse[];
  limit: number;
}

export default function DogList({ dogs, limit }: DogListProps) {
  // Take only the first 'n' samples as requested
  const sampledDogs = dogs.slice(0, limit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampledDogs.map((dog) => {
        const name = dog.attributes.name;
        const description = dog.attributes.description;
        // Fallback to a placeholder if images array is empty
        const imageUrl = dog.attributes.images[0]?.url || "https://images.dogapi.dog/01v98q4ttqulz609aw8r5h8i1g44";

        return (
          <DogCard
            key={dog.id}
            name={name}
            description={description}
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  );
}