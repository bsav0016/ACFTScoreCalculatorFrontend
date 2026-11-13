// Pure date helpers for the test-date picker. Months are 1-12 throughout. No React Native imports, so they can be
// unit tested.

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Today as { year, month, day } in the phone's local time.
export function todayParts(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// Weeks of the month, Sunday first: each week is 7 entries, a day number or null for the blank cells around the month.
export function monthGrid(year, month) {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const cells = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth(year, month); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// Moves a { year, month } by a number of months (negative goes back).
export function addMonths({ year, month }, delta) {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

const value = ({ year, month, day = 1 }) => year * 10000 + month * 100 + day;

// True when the date is after `today`. Only year and month are compared when no day is given.
export const isAfter = (date, today) => value(date) > value(today);

// Whether the picker may move to the month: not before the first allowed year, not after the current month.
export function canShowMonth({ year, month }, today, minYear) {
  if (year < minYear) return false;
  return !(year > today.year || (year === today.year && month > today.month));
}

// Keeps a picked day valid when the month changes (31 -> 30, 29 or 28) and never in the future.
export function clampDay(day, { year, month }, today) {
  let clamped = Math.min(day, daysInMonth(year, month));
  if (year === today.year && month === today.month) clamped = Math.min(clamped, today.day);
  return Math.max(clamped, 1);
}

export function formatPickedDate({ year, month, day }) {
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}
