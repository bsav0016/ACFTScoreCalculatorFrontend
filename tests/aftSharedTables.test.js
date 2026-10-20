import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { EVENTS } from '../components/Calculator/aftScoring';
import { isPlaceholder } from './helpers';

// data/aft_tables_250601.json is the AFT score table the backend uses to check every saved result. It is generated
// in ACFTScoreCalculatorBackend (tools/build_aft_tables.py, from the Army's published scale) and copied here
// unchanged. These tests keep the two repos and this app's own tables (components/Calculator/AFTScores/*.js) saying the
// same thing:
//   1. the copy here is the backend's file (same hash, pinned in both repos' tests);
//   2. every score table in the app agrees with it, cell by cell.
// When the Army issues a new scale: regenerate the file in the backend, copy it here, update EXPECTED_SHA256 in both
// repos' tests, and rebuild the app's tables until test 2 passes again.

const FILE = path.join(__dirname, '..', 'data', 'aft_tables_250601.json');
const EXPECTED_SHA256 = '79d1d89256c2d7d1e3c03de3a877274a27a1bf0e881d34644a7f3ae60a4c7140';

const text = fs.readFileSync(FILE, 'utf8');
const shared = JSON.parse(text);

test('the shared table file is the backend\'s file, byte for byte (line endings aside)', () => {
  const normalised = text.replace(/\r\n/g, '\n');
  expect(crypto.createHash('sha256').update(normalised).digest('hex')).toBe(EXPECTED_SHA256);
});

test('the shared file has the five AFT events, in the app\'s orientation', () => {
  expect(shared.version).toBe('250601');
  expect(Object.keys(shared.events)).toEqual(EVENTS.map(event => event.key));
  for (const event of EVENTS) {
    const sharedEvent = shared.events[event.key];
    expect(sharedEvent.higher_is_better).toBe(event.above);
    expect(sharedEvent.unit).toBe(event.kind === 'time' ? 'seconds' : event.kind === 'weight' ? 'lbs' : 'reps');
    for (const row of sharedEvent.rows) expect(row).toHaveLength(21);
  }
});

describe.each(EVENTS.map(event => [event.key, event]))('%s: the app\'s table agrees with the shared file', (key, event) => {
  const sharedRows = shared.events[key].rows;
  const byScore = (rows) => {
    const map = new Map();
    for (const row of rows) map.set(row[0], [...(map.get(row[0]) || []), row]);
    return map;
  };
  const ours = byScore(event.table);
  const theirs = byScore(sharedRows);

  test('has a row for every score the shared file has, and none it lacks', () => {
    expect([...ours.keys()].sort((a, b) => a - b)).toEqual([...theirs.keys()].sort((a, b) => a - b));
  });

  test('every requirement is the same (no requirement in one where the other has none)', () => {
    const mismatches = [];
    for (const [score, sharedList] of theirs) {
      if (score === 0) continue; // the app's 0-point row is an open floor; anything worse scores 0 either way
      const ourList = ours.get(score);
      // The chart prints the 60-point row twice (identical) on the SDC, plank and 2MR; the app may hold one or two.
      sharedList.slice(0, ourList.length).forEach((sharedRow, i) => {
        for (let column = 1; column <= 20; column++) {
          const shared = sharedRow[column];
          const mine = ourList[i][column];
          if (shared === null) {
            if (!isPlaceholder(event, mine)) mismatches.push(`${score} points, column ${column}: shared has none, app has ${mine}`);
          } else if (isPlaceholder(event, mine)) {
            mismatches.push(`${score} points, column ${column}: shared ${shared}, app has none`);
          } else if (event.kind === 'time') {
            // The app stores minutes rounded to a thousandth: within 0.1 s of the chart's whole seconds.
            if (Math.abs(mine * 60 - shared) > 0.1) mismatches.push(`${score} points, column ${column}: shared ${shared} s, app ${mine} min`);
          } else if (mine !== shared) {
            mismatches.push(`${score} points, column ${column}: shared ${shared}, app ${mine}`);
          }
        }
      });
    }
    expect(mismatches).toEqual([]);
  });
});
