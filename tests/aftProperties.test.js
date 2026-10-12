import { EVENTS, columnFor, rawNeeded, scoreFor, spreadPoints } from '../components/Calculator/aftScoring';
import { isPlaceholder, referenceScore } from './helpers';

// Exhaustive checks over every event x every one of the 20 columns, judged against an independent oracle
// (tests/helpers.js referenceScore) instead of the implementation's own output. All deterministic, no network.

const COLUMNS = Array.from({ length: 20 }, (_, i) => i + 1);
const notch = (event) => (event.kind === 'time' ? 1 / 60 : 1); // one second / one rep / one pound

describe.each(EVENTS.map(event => [event.key, event]))('%s', (key, event) => {
  test('scoreFor agrees with the reference oracle at, just either side of, and far from every threshold', () => {
    let checked = 0;
    for (const col of COLUMNS) {
      const candidates = new Set([0, 1, 1000]);
      for (const row of event.table) {
        const cell = row[col];
        for (const raw of [cell - 0.001, cell, cell + 0.001, cell - 1, cell + 1]) candidates.add(raw);
      }
      for (const raw of candidates) {
        expect({ key, col, raw, score: scoreFor(event, raw, col) })
          .toEqual({ key, col, raw, score: referenceScore(event, raw, col) });
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(1000);
  });

  test('a better result never scores lower', () => {
    const unit = notch(event);
    const steps = event.kind === 'time' ? 2400 : 1200; // 40 minutes in seconds, or 1200 reps / pounds
    for (const col of COLUMNS) {
      let previous = null;
      for (let i = 0; i <= steps; i++) {
        // worst plausible result first, best last
        const raw = (event.above ? i : steps - i) * unit;
        const score = scoreFor(event, raw, col);
        if (previous !== null) expect(score).toBeGreaterThanOrEqual(previous);
        previous = score;
      }
    }
  });

  test('every result earns between 0 and 100 points', () => {
    for (const col of COLUMNS) {
      for (const raw of [-5, 0, 0.5, 1, 10, 50, 99, 100, 500, 999, 5000]) {
        const score = scoreFor(event, raw, col);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  test('rawNeeded gives the least effort that earns the target, for every column and every target 1-100', () => {
    let answers = 0;
    for (const col of COLUMNS) {
      for (let target = 1; target <= 100; target++) {
        const need = rawNeeded(event, target, col);
        const reachable = event.table.some(row => row[0] >= target && !isPlaceholder(event, row[col]));
        if (!reachable) {
          expect({ key, col, target, need }).toEqual({ key, col, target, need: null });
          continue;
        }
        expect(need).not.toBeNull();
        answers++;
        // It earns at least the target, and the score it reports is what the oracle says that result earns.
        expect(referenceScore(event, need.raw, col)).toBeGreaterThanOrEqual(target);
        expect(need.score).toBe(referenceScore(event, need.raw, col));
        // And it is the minimum: one notch worse falls short of the target.
        const worse = event.above ? need.raw - notch(event) : need.raw + notch(event);
        expect({ key, col, target, worseScore: referenceScore(event, worse, col) < target })
          .toEqual({ key, col, target, worseScore: true });
      }
    }
    expect(answers).toBeGreaterThan(1500);
  });
});

describe('planning a whole result', () => {
  test('every age 17-99, both standards: when every event has an answer, the +25 plan reaches the target', () => {
    const base = { deadlift: 250, pushups: 40, sdc: 105 / 60, plank: 130 / 60, tmr: 15.5 };
    let planned = 0;
    for (let age = 17; age <= 99; age++) {
      for (const maleOrCombat of [true, false]) {
        const col = columnFor(age, maleOrCombat);
        const scores = Object.fromEntries(EVENTS.map(e => [e.key, referenceScore(e, base[e.key], col)]));
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const target = total + 25;
        if (target > 500) continue;
        const extra = spreadPoints(scores, target);
        let reached = 0;
        let everyEventAnswered = true;
        for (const e of EVENTS) {
          if (extra[e.key] === 0) { reached += scores[e.key]; continue; }
          const need = rawNeeded(e, scores[e.key] + extra[e.key], col);
          if (need === null) { everyEventAnswered = false; break; }
          reached += need.score;
        }
        if (everyEventAnswered) {
          expect({ age, maleOrCombat, reached: reached >= target }).toEqual({ age, maleOrCombat, reached: true });
          planned++;
        }
      }
    }
    expect(planned).toBeGreaterThan(100);
  });
});

describe('scoring works offline', () => {
  // The score tables are bundled with the app, so calculating and planning must never touch the network.
  const realFetch = global.fetch;
  const realXhr = global.XMLHttpRequest;
  afterEach(() => { global.fetch = realFetch; global.XMLHttpRequest = realXhr; });

  test('a full calculation and goal plan make no network request', () => {
    const fetchSpy = jest.fn(() => { throw new Error('network is off'); });
    global.fetch = fetchSpy;
    global.XMLHttpRequest = function () { throw new Error('network is off'); };

    const col = columnFor(25, true);
    const scores = {};
    for (const e of EVENTS) scores[e.key] = scoreFor(e, e.above ? 100 : 20, col);
    const target = Object.values(scores).reduce((a, b) => a + b, 0) + 25;
    const extra = spreadPoints(scores, target);
    for (const e of EVENTS) rawNeeded(e, Math.min(100, scores[e.key] + extra[e.key]), col);

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
