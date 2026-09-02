"use client";

import { useState, useEffect } from "react";

export type SettledResult<T> =
  | { status: "fulfilled"; value: T; url: string }
  | { status: "rejected"; reason: string; url: string };

interface ParallelSettledState<T> {
  results: SettledResult<T>[] | null;
  data: (T | null)[]; // Direct array of values (null where a request failed)
  loading: boolean;
  hasErrors: boolean;
}

export function useParallelFetch<T = any>(urls: string[]): ParallelSettledState<T> {
  const [results, setResults] = useState<SettledResult<T>[] | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(urls.length));

  // Serialize to prevent unnecessary re-fetches when an array literal is passed as a prop
  const serializedUrls = JSON.stringify(urls);

  useEffect(() => {
    const parsedUrls: string[] = JSON.parse(serializedUrls);

    if (!parsedUrls.length) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function fetchAll() {
      setLoading(true);

      const fetchPromises = parsedUrls.map(async (url) => {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          throw new Error(`Status ${res.status}: ${res.statusText || "Request failed"}`);
        }
        return res.json();
      });

      // Waits for every request to complete, regardless of success or failure
      const settled = await Promise.allSettled(fetchPromises);

      // Map back to a clean array including the corresponding URL
      const mappedResults: SettledResult<T>[] = settled.map((item, index) => {
        if (item.status === "fulfilled") {
          return {
            status: "fulfilled",
            value: item.value as T,
            url: parsedUrls[index],
          };
        }

        const reason =
          item.reason instanceof Error ? item.reason.message : "Unknown error";
        return {
          status: "rejected",
          reason,
          url: parsedUrls[index],
        };
      });

      setResults(mappedResults);
      setLoading(false);
    }

    fetchAll().catch((err) => {
      // Ignore manual abort errors triggered during component cleanup
      if (err?.name !== "AbortError") {
        setLoading(false);
      }
    });

    return () => {
      controller.abort();
    };
  }, [serializedUrls]);

  const data = results ? results.map((r) => (r.status === "fulfilled" ? r.value : null)) : [];
  const hasErrors = Boolean(results?.some((r) => r.status === "rejected"));

  return { results, data, loading, hasErrors };
}