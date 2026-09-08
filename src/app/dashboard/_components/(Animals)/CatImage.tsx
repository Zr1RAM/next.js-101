// CatImage.tsx
"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

const fetchCatImage = async () => {
  const response = await fetch("https://cataas.com/cat");
  if (!response.ok) throw new Error("Failed to fetch cat image");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export function CatImage() {
  const { data: catImageUrl, refetch, isFetching } = useSuspenseQuery({
    queryKey: ["randomCat"],
    queryFn: fetchCatImage,
  });

  return (
    <div className="space-y-4">
      <img 
        src={catImageUrl} 
        alt="A random cat" 
        className="max-w-[400px] rounded-lg shadow-md" 
      />
      <button 
        onClick={() => refetch()} 
        disabled={isFetching}
        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
      >
        {isFetching ? "Loading..." : "Get Another Cat"}
      </button>
    </div>
  );
}