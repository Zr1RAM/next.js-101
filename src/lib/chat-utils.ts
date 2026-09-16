export const CHAT_LIMIT_REACHED_MESSAGE =
  "The chat bot has reached its limits for now, so please try again later.";

/**
 * Checks if an error or status indicates an HTTP 429 rate limit or quota exhaustion.
 */
export function isRateLimitOrQuotaError(err: unknown): boolean {
  if (!err) return false;

  const str =
    typeof err === "string"
      ? err
      : err instanceof Error
      ? `${err.name} ${err.message} ${(err as any).stack || ""}`
      : JSON.stringify(err);

  return (
    str.includes("429") ||
    /quota/i.test(str) ||
    /limits for now/i.test(str) ||
    /resource_exhausted/i.test(str) ||
    /rate limit/i.test(str)
  );
}
