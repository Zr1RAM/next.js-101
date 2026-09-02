"use client";

import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

export function useSequentialFetch<T = any>(urls: string[]): FetchState<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(urls.length));
  const [error, setError] = useState<Error | null>(null);

  const serializedUrls = JSON.stringify(urls);

  useEffect(() => {
    const parsedUrls: string[] = JSON.parse(serializedUrls);

    if (!parsedUrls.length) {
      setData([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function fetchSequentially() {
      setLoading(true);
      setError(null);

      const results: T[] = [];

      try {
        for (const url of parsedUrls) {
          const res = await fetch(url, { signal });
          if (!res.ok) {
            throw new Error(`Failed to fetch ${url}: Status ${res.status}`);
          }
          const itemData = await res.json();
          results.push(itemData);
        }

        setData(results);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore aborts on unmount
        }
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchSequentially();

    return () => {
      controller.abort();
    };
  }, [serializedUrls]);

  return { data, loading, error };
}