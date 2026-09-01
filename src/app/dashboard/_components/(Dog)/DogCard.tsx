// app/dashboard/_components/DogCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface DogCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

export default function DogCard({ name, description, imageUrl }: DogCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm transition-all hover:shadow-md">
      {/* Image container only */}
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse z-10" />
        )}

        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, 33vw"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Content container remains unaffected by image loading */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{name}</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}