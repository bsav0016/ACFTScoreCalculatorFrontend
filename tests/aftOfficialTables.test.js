import fs from 'fs';
import path from 'path';
import { EVENTS } from '../components/Calculator/aftScoring';
import { isPlaceholder } from './helpers';

// Compares every cell of the app's five AFT score tables with the Army's published chart (effective 1 June 2025),
// stored as text in tests/fixtures/aft-score-tables-250601.txt. When the Army issues a new scale: add the new
// fixture, regenerate the tables with the scripts in pythonBuilderFiles/, and point this test at the new file.

const FIXTURE = path.join(__dirname, 'fixtures', 'aft-score-tables-250601.txt');
const BLOCK_ORDER = ['deadlift', 'pushups', 'sdc', 'plank', 'tmr'];

function loadOfficial() {
  const rows = fs.readFileSync(FIXTURE, 'utf8').split(/\r?\n/)
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .map(line => line.trim().split(/\s+/));
  const blocks = [];
  let current = [];
  for (const row of rows) {
    if (current.length && Number(row[0]) > Number(current[current.length - 1][0])) {
      blocks.push(current);
      current = [];
    }
    current.push(row);
  }
  blocks.push(current);
  return Object.fromEntries(BLOCK_ORDER.map((key, i) => [key, blocks[i]]));
}

const official = loadOfficial();
const toSeconds = (token) => { const [m, s] = token.split(':').map(Number); return m * 60 + s; };

test('the official fixture is intact: five tables of 47, 47, 102, 102 and 102 rows, 22 cells each', () => {
  expect(Object.values(official).map(rows => rows.length)).toEqual([47, 47, 102, 102, 102]);
  for (const rows of Object.values(official)) {
    for (const row of rows) {
      expect(row).toHaveLength(22);
      expect(row[21]).toBe(row[0]);
    }
  }
});

describe.each(EVENTS.map(event => [event.key, event]))('%s table matches the official chart', (key, event) => {
  const rows = official[key];
  const byScore = (list, scoreOf) => {
    const map = new Map();
    for (const row of list) {
      const score = Number(scoreOf(row));
      map.set(score, [...(map.get(score) || []), row]);
    }
    return map;
  };

  test('has a row for every score the official chart has, and none it lacks', () => {
    const ours = byScore(event.table, row => row[0]);
    const theirs = byScore(rows, row => row[0]);
    expect([...ours.keys()].sort((a, b) => a - b)).toEqual([...theirs.keys()].sort((a, b) => a - b));
    // The official chart prints the 60-point row twice (identical copies) on the SDC, plank and 2MR charts; the app
    // may hold one or two. Every other score appears exactly once in both.
    for (const [score, list] of theirs) {
      if (score === 60) continue;
      expect({ score, rows: ours.get(score).length }).toEqual({ score, rows: list.length });
    }
  });

  test('every requirement equals the official one (no requirement where the chart has none)', () => {
    const ours = byScore(event.table, row => row[0]);
    const mismatches = [];
    for (const [score, officialRows] of byScore(rows, row => row[0])) {
      if (score === 0) continue; // the app treats the 0-point row as an open floor; below or above it scores 0 anyway
      const ourRows = ours.get(score);
      officialRows.slice(0, ourRows.length).forEach((officialRow, i) => {
        for (let col = 1; col <= 20; col++) {
          const token = officialRow[col];
          const mine = ourRows[i][col];
          if (token === '---') {
            if (!isPlaceholder(event, mine)) mismatches.push(`${score} points, column ${col}: official has no requirement, app has ${mine}`);
          } else if (isPlaceholder(event, mine)) {
            mismatches.push(`${score} points, column ${col}: official ${token}, app has no requirement`);
          } else if (event.kind === 'time') {
            // The app stores minutes rounded up to a thousandth (at most 0.06 s above the chart's whole seconds).
            if (Math.abs(mine * 60 - toSeconds(token)) > 0.1) mismatches.push(`${score} points, column ${col}: official ${token}, app ${mine} min`);
          } else if (Number(token) !== mine) {
            mismatches.push(`${score} points, column ${col}: official ${token}, app ${mine}`);
          }
        }
      });
    }
    expect(mismatches).toEqual([]);
  });
});
