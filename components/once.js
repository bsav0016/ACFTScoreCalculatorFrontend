// Remembers which keys have been seen so a problem that repeats (a screen that retries, storage that fails on every
// read) is reported once per app session instead of flooding the error tracker. Pure, so it can be unit tested.
export function createOnce() {
  const seen = new Set();
  return (key) => {
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}
