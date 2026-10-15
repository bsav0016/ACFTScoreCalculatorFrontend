// Pure helpers for saving a score: checking the test date and turning the server's answer into a message for the user.
// Kept free of React Native imports so they can be unit tested.

export const MIN_YEAR = 2022;
export const STORED_MESSAGE = 'Stored ACFT score'; // what the API sends back on success

// The date dialog holds numbers until a field is edited and strings after, so accept both. Returns null for anything
// that is not a whole number (blank, "1.5", "abc").
function wholeNumber(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? value : null;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value.trim());
  return null;
}

// Returns a message to show next to the date fields, or null when the date is fine.
export function validateTestDate({ day, month, year }) {
  const d = wholeNumber(day);
  const m = wholeNumber(month);
  const y = wholeNumber(year);
  if (d === null || d < 1 || d > 31) return 'Day must be a whole number from 1 to 31.';
  if (m === null || m < 1 || m > 12) return 'Month must be a whole number from 1 to 12.';
  if (y === null || y < MIN_YEAR) return `Year must be ${MIN_YEAR} or later.`;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return 'That date does not exist.';
  }
  return null;
}

// Turns what came back from the save request into { type: 'success' | 'error', message }.
//   status / ok: from the fetch response; body: the parsed JSON, or null when it was not JSON.
//   networkError: true when the request never got an answer (offline, timeout).
export function describeSaveResult({ status, ok, body, networkError } = {}) {
  if (networkError) {
    return { type: 'error', message: "Couldn't reach the server. Check your connection and try again." };
  }
  if (status === 401 || status === 403) {
    return { type: 'error', message: 'Please log in again to save your score.' };
  }
  if (ok && body && body.message === STORED_MESSAGE) {
    return { type: 'success', message: 'Score saved.' };
  }
  if (!ok && body && typeof body.message === 'string' && body.message) {
    return { type: 'error', message: body.message };
  }
  return { type: 'error', message: 'Something went wrong saving your score. Please try again.' };
}
