// AFT scoring as plain functions, so the goal planner can run the score tables in both directions.
//
// Each table is a list of rows [score, col1, col2, ... col20, score], ordered from 100 points down to 0. The columns
// are age groups, one for "male or combat MOS" and one for "female non-combat" (see AGE_GROUPS). A cell holds the raw
// result needed for that row's score; 999 / 99 mark a cell that doesn't exist for that column.
import aftDeadliftScores from './AFTScores/deadliftScores';
import aftPushupScores from './AFTScores/pushupScores';
import aftSDCScores from './AFTScores/SDCScores';
import aftPlankScores from './AFTScores/plankScores';
import aftRunScores from './AFTScores/runScores';

// Same brackets the calculator uses: a person is in the first group whose maxAge is above their age.
export const AGE_GROUPS = [
  { maxAge: 22, maleIndex: 1, femaleIndex: 2 },
  { maxAge: 27, maleIndex: 3, femaleIndex: 4 },
  { maxAge: 32, maleIndex: 5, femaleIndex: 6 },
  { maxAge: 37, maleIndex: 7, femaleIndex: 8 },
  { maxAge: 42, maleIndex: 9, femaleIndex: 10 },
  { maxAge: 47, maleIndex: 11, femaleIndex: 12 },
  { maxAge: 52, maleIndex: 13, femaleIndex: 14 },
  { maxAge: 57, maleIndex: 15, femaleIndex: 16 },
  { maxAge: 62, maleIndex: 17, femaleIndex: 18 },
  { maxAge: Infinity, maleIndex: 19, femaleIndex: 20 },
];

// `above`: more is better (weight, reps, plank time). Time events are held in decimal minutes, as the tables are.
// `missingAt`: a cell at or above this value is a placeholder, not a real requirement (each table uses its own).
export const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', table: aftDeadliftScores, above: true, kind: 'weight', missingAt: 999 },
  { key: 'pushups', label: 'T-Push Ups', table: aftPushupScores, above: true, kind: 'reps', missingAt: 99 },
  { key: 'sdc', label: 'SDC', table: aftSDCScores, above: false, kind: 'time', missingAt: 99 },
  { key: 'plank', label: 'Plank', table: aftPlankScores, above: true, kind: 'time', missingAt: 99 },
  { key: 'tmr', label: '2MR', table: aftRunScores, above: false, kind: 'time', missingAt: 99 },
];

export const MAX_TOTAL = 500;

export function columnFor(age, maleOrCombat) {
  const group = AGE_GROUPS.find(g => age < g.maxAge);
  return maleOrCombat ? group.maleIndex : group.femaleIndex;
}

// Points for a raw result: the first (highest) row the result reaches. Mirrors the calculator exactly.
export function scoreFor(event, raw, column) {
  for (const row of event.table) {
    if (event.above ? raw >= row[column] : raw <= row[column]) return row[0];
  }
  return 0;
}

// A zero on a lower-is-better event (a time of 0:00) is a placeholder too: nobody can finish that fast.
const isMissingCell = (event, value) => value >= event.missingAt || (!event.above && value <= 0);

// The least you have to do to earn at least `target` points: among the rows at or above the target, the most lenient
// requirement that exists for this column (a few table rows aren't strictly ordered, so it isn't always the lowest
// row). Returns { score, raw } where `score` is what that result really earns (raw in table units; for time events,
// whole seconds / 60), or null if no row qualifies.
export function rawNeeded(event, target, column) {
  let best = null;
  for (const row of event.table) {
    if (row[0] < target) break;
    const threshold = row[column];
    if (isMissingCell(event, threshold)) continue;
    if (best === null || (event.above ? threshold < best : threshold > best)) best = threshold;
  }
  if (best === null) return null;

  let raw = best;
  if (event.kind === 'time') {
    // Whole seconds only: round toward the harder side so the rounded result still earns the points.
    const seconds = event.above ? Math.ceil(best * 60 - 1e-6) : Math.floor(best * 60 + 1e-6);
    raw = seconds / 60;
  }
  return { score: scoreFor(event, raw, column), raw };
}

// Spread the points still needed one at a time across the events that aren't maxed out, so the plan is even.
// `scores` maps event key -> current score; returns event key -> extra points to gain (may fall short past 500).
export function spreadPoints(scores, target) {
  const keys = Object.keys(scores);
  const extra = Object.fromEntries(keys.map(key => [key, 0]));
  let needed = target - keys.reduce((sum, key) => sum + scores[key], 0);
  while (needed > 0) {
    const open = keys.filter(key => scores[key] + extra[key] < 100);
    if (open.length === 0) break;
    for (const key of open) {
      if (needed <= 0) break;
      extra[key] += 1;
      needed -= 1;
    }
  }
  return extra;
}

const pad = (n) => String(n).padStart(2, '0');

// "1:45" for times, "250 lbs" / "40 reps" otherwise.
export function formatRaw(event, raw) {
  if (event.kind === 'weight') return `${raw} lbs`;
  if (event.kind === 'reps') return `${raw} reps`;
  const seconds = Math.round(raw * 60);
  return `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`;
}

// The change from what you did to what's needed, e.g. "+12 lbs", "9 sec faster" or "2:05 faster".
export function describeChange(event, from, to) {
  if (event.kind === 'time') {
    const seconds = Math.abs(Math.round((to - from) * 60));
    const better = event.above ? to > from : to < from;
    if (seconds === 0) return 'same';
    const amount = seconds >= 60 ? `${Math.floor(seconds / 60)}:${pad(seconds % 60)}` : `${seconds} sec`;
    return `${amount} ${better ? (event.above ? 'longer' : 'faster') : (event.above ? 'shorter' : 'slower')}`;
  }
  const diff = Math.round(to - from);
  return `${diff >= 0 ? '+' : ''}${diff} ${event.kind === 'weight' ? 'lbs' : 'reps'}`;
}
