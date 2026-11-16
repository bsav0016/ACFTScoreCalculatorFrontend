// Whether a failed fetch just never got an answer: the phone is offline, the connection dropped, or the request was
// cancelled (by the app after its own timeout, or by the system when the app goes to the background). These are normal
// on a phone, so they are not worth a bug report.
//
// React Native's fetch signals being offline with a TypeError, and an abort through an AbortController with an
// AbortError. Expo's native fetch (used on iOS) instead throws a plain Error whose message starts "fetch failed:" and
// ends with the native reason, for example "fetch failed: FetchRequestCanceledException: Fetch request has been canceled".
export function isNetworkFailure(error) {
  if (!error) return false;
  if (error instanceof TypeError) return true;
  if (error.name === 'AbortError') return true;
  return /^fetch failed\b/i.test(String(error.message || ''));
}
