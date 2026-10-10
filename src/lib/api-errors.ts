/**
 * User-facing messages for failed API calls, shared by every client fetch path.
 *
 * HTTP 429 (rate limited) and 5xx (server fault) get fixed, friendly wording instead of whatever the response body
 * says: a rate limit hit at the platform edge or a crashed function may not answer with our JSON at all. Other 4xx
 * responses carry a message meant for the user (validation, UTR already used, registrations closed), so callers keep
 * showing those. Dependency-free so the unit tests can import it directly.
 */

export const RATE_LIMIT_MESSAGE = 'Too many requests. Please wait a little and try again.';
export const SERVER_ERROR_MESSAGE = 'Something went wrong on our server. Please try again shortly.';

// Longer waits than this are treated as a malformed header and get the generic wording.
const MAX_RETRY_AFTER_SECONDS = 24 * 60 * 60;
// IMF-fixdate, the only HTTP-date form a sender may generate (RFC 9110 §5.6.7), e.g. "Sun, 11 Oct 2026 08:49:37 GMT".
const IMF_FIXDATE = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;

/**
 * Seconds to wait from a `Retry-After` header (delta-seconds or an HTTP-date), or null when it is missing or invalid.
 * A date already in the past means "now" (0).
 */
export function parseRetryAfter(value: string | null | undefined, now: number = Date.now()): number | null {
  const raw = value?.trim();
  if (!raw) return null;
  let seconds: number;
  if (/^\d+$/.test(raw)) {
    seconds = Number(raw);
  } else if (IMF_FIXDATE.test(raw)) {
    const at = Date.parse(raw);
    if (Number.isNaN(at)) return null;
    seconds = Math.max(0, Math.ceil((at - now) / 1000));
  } else {
    return null;
  }
  return seconds <= MAX_RETRY_AFTER_SECONDS ? seconds : null;
}

/** "about 30 seconds", "about 2 minutes", "about 1 hour": rounded up, so the user never retries too early. */
export function formatWait(seconds: number): string {
  const unit = (n: number, word: string) => `about ${n} ${word}${n === 1 ? '' : 's'}`;
  if (seconds < 60) return unit(Math.max(1, Math.ceil(seconds)), 'second');
  if (seconds < 60 * 60) return unit(Math.ceil(seconds / 60), 'minute');
  return unit(Math.ceil(seconds / 3600), 'hour');
}

/** The 429 message, naming the wait when the server said how long (a usable, non-zero Retry-After). */
export function rateLimitMessage(retryAfterSeconds: number | null): string {
  if (!retryAfterSeconds) return RATE_LIMIT_MESSAGE;
  return `Too many requests. Please wait ${formatWait(retryAfterSeconds)} and try again.`;
}

type ResponseLike = { status: number; headers: { get(name: string): string | null } };

/**
 * Friendly message for a rate-limited (429) or server-error (5xx) response, or null for any other status, where the
 * caller shows the message from the response body.
 */
export function httpErrorMessage(res: ResponseLike, now: number = Date.now()): string | null {
  if (res.status === 429) return rateLimitMessage(parseRetryAfter(res.headers.get('retry-after'), now));
  if (res.status >= 500) return SERVER_ERROR_MESSAGE;
  return null;
}

/**
 * Whether a failed request is worth retrying by hand with the same input: rate limited, a server fault, or no response
 * at all (`status` undefined). The client keeps the user's form data and file for these. Never retried automatically.
 */
export function isTransientFailure(status: number | undefined): boolean {
  return status === undefined || status === 429 || status >= 500;
}
