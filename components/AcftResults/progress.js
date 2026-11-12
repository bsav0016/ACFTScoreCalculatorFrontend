// Pure helpers that turn the saved results from GET api/users/{id}/ into a progress summary.
// Only AFT results (500 points, five events) are trended; retired ACFT results (600 points, six events)
// are returned separately because their totals and time encoding are not comparable.

export const AFT_EVENTS = [
  { key: 'deadlift', label: 'Deadlift' },
  { key: 'pushups', label: 'T-Push Ups' },
  { key: 'sdc', label: 'SDC' },
  { key: 'plank', label: 'Plank' },
  { key: 'tmr', label: '2MR' },
];

export const AFT_MAX_TOTAL = 500;

export const isAft = (result) => result.standard === 'AFT';

// AFT results store plain seconds. ACFT results saved by the app join "minutes * 60" and the seconds as text
// (1:45 -> 6045), so they decode differently.
export const formatTime = (raw, standard) => {
  const minutes = standard === 'AFT' ? Math.floor(raw / 60) : Math.floor(raw / 6000);
  const seconds = raw % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const dateValue = (r) => r.year * 10000 + r.month * 100 + r.day;

// Oldest first; same-day results fall back to id, which grows with save order.
export const byDateAscending = (a, b) => (dateValue(a) - dateValue(b)) || (a.id - b.id);
export const byDateDescending = (a, b) => byDateAscending(b, a);

const eventScore = (result, key) => result[`${key}_score`];

// Results saved before server scoring have a blank table_version; treat blank as one group.
const tableOf = (result) => result.table_version || '';

export function buildProgress(results) {
  const all = Array.isArray(results) ? results : [];
  const aft = all.filter(isAft).sort(byDateAscending);
  const acft = all.filter((r) => !isAft(r)).sort(byDateDescending);

  const latest = aft.length ? aft[aft.length - 1] : null;
  const previous = aft.length > 1 ? aft[aft.length - 2] : null;

  const totalDelta = latest && previous ? latest.total_score - previous.total_score : null;
  const eventDeltas = {};
  for (const { key } of AFT_EVENTS) {
    eventDeltas[key] = latest && previous ? eventScore(latest, key) - eventScore(previous, key) : null;
  }

  // Highest score per event across all AFT results; the earliest result wins a tie.
  const bests = {};
  for (const { key } of AFT_EVENTS) {
    let best = null;
    for (const r of aft) {
      const score = eventScore(r, key);
      if (best === null || score > best.score) best = { score, result: r };
    }
    bests[key] = best;
  }

  const bestTotal = aft.reduce((best, r) => (best === null || r.total_score > best.total_score ? r : best), null);

  // Lowest event in the latest result; the first event in list order wins a tie.
  let weakest = null;
  if (latest) {
    for (const { key, label } of AFT_EVENTS) {
      const score = eventScore(latest, key);
      if (weakest === null || score < weakest.score) weakest = { key, label, score };
    }
  }

  // Change in total versus the test before each one (null for the first), and whether both were scored on the
  // same table.
  const changes = {};
  aft.forEach((r, i) => {
    const before = i > 0 ? aft[i - 1] : null;
    changes[r.id] = before
      ? { delta: r.total_score - before.total_score, comparable: tableOf(r) === tableOf(before) }
      : { delta: null, comparable: true };
  });

  return {
    aft,
    acft,
    changes,
    latest,
    previous,
    totalDelta,
    eventDeltas,
    bests,
    bestTotal,
    weakest,
    series: aft.map((r) => ({ id: r.id, total: r.total_score })),
    // Totals scored on different tables are shown but not strictly comparable.
    comparable: !latest || !previous || tableOf(latest) === tableOf(previous),
  };
}
