// Shared by the scoring tests. Nothing here calls the code under test.

// Placeholder cells: a column that has no requirement for a row holds 999 (deadlift) or 99 (everything else), and a
// lower-is-better table also uses 0. Any cell like this can never be met by a real result.
export const isPlaceholder = (event, cell) => cell >= event.missingAt || (!event.above && cell <= 0);

// Reference oracle for "how many points does this result earn". Deliberately a different formulation from
// aftScoring.scoreFor (which walks the rows top-down and stops at the first one reached): this takes the best score
// over every row the result satisfies. They agree because rows run from 100 points down to 0.
export function referenceScore(event, raw, column) {
  let best = 0;
  for (const row of event.table) {
    const met = event.above ? raw >= row[column] : raw <= row[column];
    if (met && row[0] > best) best = row[0];
  }
  return best;
}

export const AFT_EVENT_KEYS = ['deadlift', 'pushups', 'sdc', 'plank', 'tmr'];
