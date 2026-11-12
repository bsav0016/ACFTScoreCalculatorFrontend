// The AFT target total, stored on the account (GET/PATCH api/users/demographics/) so the planner and the saved results
// screen share one goal across devices. `request` is authFetch (path, options) -> Response.
import { AFT_MAX_TOTAL } from './progress';

// A whole number from 0 to 500, or null for anything else (including blank text).
export function parseTarget(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value >= 0 && value <= AFT_MAX_TOTAL ? value : null;
  }
  if (typeof value !== 'string' || !/^\s*\d{1,3}\s*$/.test(value)) return null;
  return parseTarget(parseInt(value, 10));
}

// The saved target, or null when none is set, the person is signed out, or the server can't be reached.
export async function fetchTarget(request) {
  try {
    const response = await request('api/users/demographics/');
    if (!response.ok) return null;
    const data = await response.json();
    return parseTarget(data && data.target_total);
  } catch {
    return null;
  }
}

// Saves (or, with null, clears) the target. Returns true only when the server accepted it.
export async function saveTarget(request, value) {
  if (value !== null && parseTarget(value) === null) return false;
  try {
    const response = await request('api/users/demographics/', {
      method: 'PATCH',
      body: JSON.stringify({ target_total: value }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// How far a total is from the target.
export function targetStatus(target, total) {
  if (target === null || target === undefined || total === null || total === undefined) return null;
  return total >= target ? { reached: true, remaining: 0 } : { reached: false, remaining: target - total };
}
