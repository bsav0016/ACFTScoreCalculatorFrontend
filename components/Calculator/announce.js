// What a screen reader says as the calculator's scores change. Pure, so it is tested without a screen.
//
// A snapshot is { scores, entered }: scores[key] is the points for each event and entered[key] says whether the person
// has typed anything for it. The announcement covers only what changed since the last one, and the total once all five
// events are in. Nothing changed means nothing is said.
import { EVENTS, MAX_TOTAL } from './aftScoring';

// The on-screen names are short (SDC, 2MR); a screen reader should say them out.
export const SPOKEN_NAMES = {
  deadlift: 'Deadlift',
  pushups: 'T push-ups',
  sdc: 'Sprint drag carry',
  plank: 'Plank',
  tmr: 'Two mile run',
};

const points = (n) => `${n} ${n === 1 ? 'point' : 'points'}`;

export function buildAnnouncement(previous, current, max = MAX_TOTAL) {
  const parts = [];
  let anyChange = false;
  for (const { key } of EVENTS) {
    const wasEntered = !!previous.entered[key];
    const isEntered = !!current.entered[key];
    if (isEntered && (!wasEntered || previous.scores[key] !== current.scores[key])) {
      parts.push(`${SPOKEN_NAMES[key]} ${points(current.scores[key])}`);
      anyChange = true;
    } else if (wasEntered && !isEntered) {
      parts.push(`${SPOKEN_NAMES[key]} cleared`);
      anyChange = true;
    }
  }
  if (!anyChange) return '';

  const allEntered = EVENTS.every(({ key }) => current.entered[key]);
  const total = EVENTS.reduce((sum, { key }) => sum + (current.scores[key] || 0), 0);
  if (allEntered) parts.push(`Total ${total} of ${max}`);
  else if (!EVENTS.some(({ key }) => current.entered[key])) return 'All events cleared';
  return `${parts.join('. ')}.`;
}

export const EMPTY_SNAPSHOT = { scores: {}, entered: {} };
