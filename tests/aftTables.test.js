import { EVENTS } from '../components/Calculator/aftScoring';
import acftDeadlift from '../components/ACFTCalculator/Scores/deadliftScores';
import acftPushups from '../components/ACFTCalculator/Scores/pushupScores';
import acftSDC from '../components/ACFTCalculator/Scores/SDCScores';
import acftPlank from '../components/ACFTCalculator/Scores/plankScores';
import acftRun from '../components/ACFTCalculator/Scores/runScores';
import acftBall from '../components/ACFTCalculator/Scores/ballThrowScores';
import { isPlaceholder } from './helpers';

// Each row is [score, 20 age/sex columns, score]. These tests guard the shape of the data itself, so a bad edit to a
// table (a dropped cell, a shifted column, a mistyped number) fails here before it reaches a calculator.

const ROW_LENGTH = 22;

describe.each(EVENTS.map(event => [event.key, event]))('AFT %s table', (key, event) => {
  const { table } = event;

  test('every row has a score, 20 columns, and the same score again at the end', () => {
    for (const row of table) {
      expect(row).toHaveLength(ROW_LENGTH);
      expect(row[ROW_LENGTH - 1]).toBe(row[0]);
    }
  });

  test('every cell is a finite number', () => {
    for (const row of table) for (const cell of row) expect(Number.isFinite(cell)).toBe(true);
  });

  test('runs from 100 points down to 0 and never goes up', () => {
    const scores = table.map(row => row[0]);
    expect(scores[0]).toBe(100);
    expect(scores[scores.length - 1]).toBe(0);
    scores.forEach((score, i) => {
      expect(Number.isInteger(score)).toBe(true);
      if (i > 0) expect(score).toBeLessThanOrEqual(scores[i - 1]);
    });
  });

  test('the 0-point row accepts every result (0 on more-is-better events, 99 on less-is-better ones)', () => {
    const last = table[table.length - 1];
    const floor = event.above ? 0 : 99;
    for (let col = 1; col <= 20; col++) expect(last[col]).toBe(floor);
  });

  test('every column can reach 100 and 60 points with a real requirement', () => {
    for (let col = 1; col <= 20; col++) {
      for (const target of [100, 60]) {
        const reachable = table.some(row => row[0] >= target && !isPlaceholder(event, row[col]));
        expect({ key, col, target, reachable }).toEqual({ key, col, target, reachable: true });
      }
    }
  });

  test('requirements only get easier as points drop', () => {
    const outOfOrder = [];
    for (let col = 1; col <= 20; col++) {
      for (let i = 1; i < table.length; i++) {
        const above = table[i - 1][col];
        const below = table[i][col];
        if (isPlaceholder(event, above) || isPlaceholder(event, below)) continue;
        if (event.above ? below > above : below < above) outOfOrder.push(`${table[i][0]} points, column ${col}`);
      }
    }
    expect(outOfOrder).toEqual([]);
  });
});

// The official chart prints the 60-point row twice (identical copies) on the SDC, plank and 2MR charts.
test('the 2MR table has exactly one duplicated row (60 points), and the copies are identical', () => {
  const run = EVENTS.find(event => event.key === 'tmr').table;
  const sixties = run.filter(row => row[0] === 60);
  expect(sixties).toHaveLength(2);
  expect(sixties[0]).toEqual(sixties[1]);
  const duplicated = run.map(row => row[0]).filter((score, i, all) => all.indexOf(score) !== i);
  expect(duplicated).toEqual([60]);
});

test('deadlift and push-up tables step 1 point at a time down to 60, then 10 at a time', () => {
  for (const key of ['deadlift', 'pushups']) {
    const scores = EVENTS.find(event => event.key === key).table.map(row => row[0]);
    const expected = [...Array.from({ length: 41 }, (_, i) => 100 - i), 50, 40, 30, 20, 10, 0];
    expect(scores).toEqual(expected);
  }
});

test('SDC and plank tables have one row for every score from 100 to 0', () => {
  for (const key of ['sdc', 'plank']) {
    const scores = EVENTS.find(event => event.key === key).table.map(row => row[0]);
    expect(scores).toEqual(Array.from({ length: 101 }, (_, i) => 100 - i));
  }
});

// The ACFT tables ship as "Historical Standards". Their placeholder conventions differ, so only the shape is checked.
describe.each([
  ['deadlift', acftDeadlift], ['push-ups', acftPushups], ['SDC', acftSDC],
  ['plank', acftPlank], ['2MR', acftRun], ['ball throw', acftBall],
])('ACFT %s table', (name, table) => {
  test('every row has 22 finite cells, starts at 100 points, ends at 0 and never goes up', () => {
    for (const row of table) {
      expect(row).toHaveLength(ROW_LENGTH);
      for (const cell of row) expect(Number.isFinite(cell)).toBe(true);
    }
    const scores = table.map(row => row[0]);
    expect(scores[0]).toBe(100);
    expect(scores[scores.length - 1]).toBe(0);
    scores.forEach((score, i) => { if (i > 0) expect(score).toBeLessThanOrEqual(scores[i - 1]); });
  });
});
