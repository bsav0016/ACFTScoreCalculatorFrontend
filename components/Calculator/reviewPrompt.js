// When to ask for a store rating. The old rule asked on 1 in 10 opens of the calculator, which lands in the middle of
// typing numbers. This asks right after something went well (a score saved, a score shared), and at most once every
// MIN_DAYS_BETWEEN days. The stores apply their own limits on top of this, so a request may still show nothing.
// Kept free of React Native imports so it can be unit tested.
export const MIN_DAYS_BETWEEN = 120;
export const STORAGE_KEY = 'review-asked-at';

const DAY_MS = 24 * 60 * 60 * 1000;

/** `lastAskedAt` is a millisecond timestamp, or null/garbage if we never asked. */
export function shouldAskForReview(lastAskedAt, now) {
  if (!Number.isFinite(lastAskedAt)) return true;
  if (lastAskedAt > now) return false; // a clock that went backwards: wait rather than ask twice in a row
  return now - lastAskedAt >= MIN_DAYS_BETWEEN * DAY_MS;
}

/**
 * Asks for a rating if it is time. `store` is { get(key), set(key, value) } (AsyncStorage) and `review` is
 * expo-store-review. Never throws: asking for a rating must not break saving or sharing.
 */
export async function askForReviewIfDue({ store, review, now = Date.now() }) {
  try {
    const last = Number(await store.get(STORAGE_KEY));
    if (!shouldAskForReview(Number.isFinite(last) && last > 0 ? last : null, now)) return false;
    if (!(await review.isAvailableAsync()) || !review.hasAction()) return false;
    await store.set(STORAGE_KEY, String(now));
    await review.requestReview();
    return true;
  } catch {
    return false;
  }
}
