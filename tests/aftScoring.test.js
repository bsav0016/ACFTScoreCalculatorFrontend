import {
  AGE_GROUPS, EVENTS, MAX_TOTAL, columnFor, describeChange, formatRaw, rawNeeded, scoreFor, spreadPoints,
} from '../components/Calculator/aftScoring';

const event = (key) => EVENTS.find(e => e.key === key);
const min = (minutes, seconds) => minutes + seconds / 60; // the calculator holds times in decimal minutes

// ---------------------------------------------------------------------------------------------------------------
// Golden fixtures. Every expected value below was read by hand from the threshold cells of the committed score tables
// (components/Calculator/AFTScores/*.js), not produced by running the code under test. Each case sits exactly on a
// table threshold and one step past it, because off-by-one at a boundary is the likeliest way to mis-score a soldier.
// The tables themselves were built from the published AFT scoring scales; these tests pin the code to the tables,
// they do not re-verify the tables against the Army publication.
//
// Age 25 uses column 3 (male / combat MOS) and column 4 (female non-combat).
//   deadlift  col3: 100=350  99=340  98=n/a  97=330  96=n/a  95=320  ...  60=150  50=130  40=120
//             col4: 100=230  99=n/a  98=220  97=210  ...  60=120  50=110
//   push-ups  col3: 100=61  99=59  98=57  ...  60=14  50=9  40=8      col4: 100=50  99=45  98=44  ...  60=11  50=9
//   SDC       col3: 100=1.5  99=1.534  98=1.55  60=2.517  59=2.534    col4: 100=1.917  99=1.934  60=3.25  59=3.267
//   plank     both: 100=3.583  99=3.533  98=3.483  60=1.416  59=n/a  58=1.4
//   2MR       col3: 100=13.417  99=13.784  98=13.917  60=19.75  59=19.8   col4: 100=15.5  99=15.734  60=22.75  59=22.8
// ("n/a" is a placeholder cell: 999 for the deadlift, 99 elsewhere.)
// ---------------------------------------------------------------------------------------------------------------
describe('golden scores at table thresholds (age 25)', () => {
  const MALE = 3;
  const FEMALE = 4;
  test.each([
    // event, raw, column, expected points
    ['deadlift', 350, MALE, 100], ['deadlift', 349, MALE, 99], ['deadlift', 340, MALE, 99],
    ['deadlift', 339, MALE, 97], ['deadlift', 330, MALE, 97], ['deadlift', 329, MALE, 95], ['deadlift', 320, MALE, 95],
    ['deadlift', 150, MALE, 60], ['deadlift', 149, MALE, 50], ['deadlift', 130, MALE, 50], ['deadlift', 129, MALE, 40],
    ['deadlift', 230, FEMALE, 100], ['deadlift', 229, FEMALE, 98], ['deadlift', 220, FEMALE, 98],
    ['deadlift', 219, FEMALE, 97], ['deadlift', 210, FEMALE, 97],
    ['deadlift', 120, FEMALE, 60], ['deadlift', 119, FEMALE, 50], ['deadlift', 110, FEMALE, 50],
    ['pushups', 61, MALE, 100], ['pushups', 60, MALE, 99], ['pushups', 59, MALE, 99], ['pushups', 58, MALE, 98],
    ['pushups', 14, MALE, 60], ['pushups', 13, MALE, 50], ['pushups', 9, MALE, 50], ['pushups', 8, MALE, 40],
    ['pushups', 50, FEMALE, 100], ['pushups', 49, FEMALE, 99], ['pushups', 45, FEMALE, 99], ['pushups', 44, FEMALE, 98],
    ['pushups', 11, FEMALE, 60], ['pushups', 10, FEMALE, 50], ['pushups', 9, FEMALE, 50],
    ['sdc', 1.5, MALE, 100], ['sdc', 1.501, MALE, 99], ['sdc', 1.534, MALE, 99], ['sdc', 1.535, MALE, 98],
    ['sdc', 2.517, MALE, 60], ['sdc', 2.518, MALE, 59], ['sdc', 2.534, MALE, 59],
    ['sdc', 1.917, FEMALE, 100], ['sdc', 1.918, FEMALE, 99], ['sdc', 1.934, FEMALE, 99],
    ['sdc', 3.25, FEMALE, 60], ['sdc', 3.251, FEMALE, 59], ['sdc', 3.267, FEMALE, 59],
    ['plank', 3.583, MALE, 100], ['plank', 3.582, MALE, 99], ['plank', 3.533, MALE, 99], ['plank', 3.532, MALE, 98],
    ['plank', 1.416, MALE, 60], ['plank', 1.415, MALE, 58], ['plank', 1.4, MALE, 58],
    ['plank', 3.583, FEMALE, 100], ['plank', 1.416, FEMALE, 60], ['plank', 1.415, FEMALE, 58],
    ['tmr', 13.417, MALE, 100], ['tmr', 13.418, MALE, 99], ['tmr', 13.784, MALE, 99], ['tmr', 13.785, MALE, 98],
    ['tmr', 19.75, MALE, 60], ['tmr', 19.751, MALE, 59], ['tmr', 19.8, MALE, 59],
    ['tmr', 15.5, FEMALE, 100], ['tmr', 15.501, FEMALE, 99], ['tmr', 22.75, FEMALE, 60], ['tmr', 22.751, FEMALE, 59],
    ['tmr', 22.8, FEMALE, 59],
  ])('%s %p in column %i scores %i', (key, raw, column, expected) => {
    expect(scoreFor(event(key), raw, column)).toBe(expected);
  });

  test('times typed as minutes and seconds land on the same row as their decimal value', () => {
    expect(scoreFor(event('tmr'), min(13, 25), MALE)).toBe(100); // 13:25 = 805 s, inside the 100-point limit of 805.02 s
    expect(scoreFor(event('tmr'), min(13, 26), MALE)).toBe(99); // 13:26 = 806 s, one second over it
    expect(scoreFor(event('tmr'), min(19, 45), MALE)).toBe(60); // 19:45 = 19.75 min, exactly the 60-point limit
    expect(scoreFor(event('sdc'), min(1, 30), MALE)).toBe(100); // 1:30 = 1.5 min
    expect(scoreFor(event('plank'), min(3, 35), MALE)).toBe(100); // 3:35 = 215 s, just past the 100-point plank time of 214.98 s
    expect(scoreFor(event('plank'), min(3, 34), MALE)).toBe(99); // 3:34 = 214 s, one second short of it
  });

  test('a result worse than the last real row scores 0', () => {
    expect(scoreFor(event('deadlift'), 0, MALE)).toBe(0);
    expect(scoreFor(event('pushups'), 0, MALE)).toBe(0);
    expect(scoreFor(event('sdc'), 99, MALE)).toBe(0);
    expect(scoreFor(event('sdc'), 100, MALE)).toBe(0);
    expect(scoreFor(event('tmr'), 100, FEMALE)).toBe(0);
  });
});

describe('age groups change the requirement exactly at 22, 27, 32, ...', () => {
  // Deadlift: column 1 (male 17-21) 100 = 340; column 3 (male 22-26) 100 = 350, 99 = 340; column 5 (male 27-31)
  // 100 = 350, 99 = n/a, 98 = 340; column 2 (female 17-21) 100 = 220; column 4 (female 22-26) 100 = 230, 98 = 220.
  const deadlift = event('deadlift');
  test('340 lbs is 100 points for a 21-year-old man but only 99 for a 22-year-old', () => {
    expect(scoreFor(deadlift, 340, columnFor(21, true))).toBe(100);
    expect(scoreFor(deadlift, 340, columnFor(22, true))).toBe(99);
  });
  test('349 lbs is 99 points at 26 but 98 at 27', () => {
    expect(scoreFor(deadlift, 349, columnFor(26, true))).toBe(99);
    expect(scoreFor(deadlift, 349, columnFor(27, true))).toBe(98);
  });
  test('220 lbs is 100 points for a 21-year-old woman but 98 for a 22-year-old', () => {
    expect(scoreFor(deadlift, 220, columnFor(21, false))).toBe(100);
    expect(scoreFor(deadlift, 220, columnFor(22, false))).toBe(98);
  });
});

describe('columnFor', () => {
  // The official AFT age groups: 17-21, 22-26, 27-31, 32-36, 37-41, 42-46, 47-51, 52-56, 57-61, 62+.
  test.each([
    [17, 1, 2], [21, 1, 2], [22, 3, 4], [26, 3, 4], [27, 5, 6], [31, 5, 6], [32, 7, 8], [36, 7, 8],
    [37, 9, 10], [41, 9, 10], [42, 11, 12], [46, 11, 12], [47, 13, 14], [51, 13, 14],
    [52, 15, 16], [56, 15, 16], [57, 17, 18], [61, 17, 18], [62, 19, 20], [99, 19, 20],
  ])('age %i uses column %i (male/combat) and %i (female)', (age, male, female) => {
    expect(columnFor(age, true)).toBe(male);
    expect(columnFor(age, false)).toBe(female);
  });

  test('there are ten age groups with consecutive, non-overlapping columns', () => {
    expect(AGE_GROUPS).toHaveLength(10);
    AGE_GROUPS.forEach((group, i) => {
      expect(group.maleIndex).toBe(1 + 2 * i);
      expect(group.femaleIndex).toBe(2 + 2 * i);
    });
    expect(AGE_GROUPS.map(g => g.maxAge)).toEqual([22, 27, 32, 37, 42, 47, 52, 57, 62, Infinity]);
  });

  // Callers (the calculator, the planner) check the age is 17-99 before scoring. These pin what happens if one doesn't.
  test('an age below 17 falls into the youngest group', () => {
    expect(columnFor(16, true)).toBe(1);
    expect(columnFor(0, false)).toBe(2);
  });
  test('a missing or non-numeric age throws instead of guessing a column', () => {
    expect(() => columnFor(NaN, true)).toThrow(TypeError);
    expect(() => columnFor(undefined, false)).toThrow(TypeError);
  });
});

describe('scoreFor with unusual input', () => {
  test('NaN scores 0 on every event rather than a made-up value', () => {
    for (const e of EVENTS) expect(scoreFor(e, NaN, 3)).toBe(0);
  });
  test('negative reps and weights score 0', () => {
    expect(scoreFor(event('pushups'), -5, 3)).toBe(0);
    expect(scoreFor(event('deadlift'), -1, 3)).toBe(0);
  });
  test('absurdly large results on a more-is-better event cap at 100, and on a time event at 0', () => {
    expect(scoreFor(event('deadlift'), 10000, 3)).toBe(100);
    expect(scoreFor(event('plank'), 600, 3)).toBe(100);
    expect(scoreFor(event('tmr'), 600, 3)).toBe(0);
  });
  test('a total can never exceed 500', () => {
    expect(MAX_TOTAL).toBe(500);
    expect(EVENTS).toHaveLength(5);
    expect(EVENTS.length * 100).toBe(MAX_TOTAL);
  });
});

describe('rawNeeded (goal planner, table read backwards)', () => {
  // Expected values come from the same table cells listed at the top of this file.
  test.each([
    // event, target points, column, expected raw result, points that result really earns
    ['deadlift', 100, 3, 350, 100],
    ['deadlift', 100, 1, 340, 100],
    ['deadlift', 99, 1, 340, 100], // the 99-point cell for this column is a placeholder, so 100 is the only way
    ['deadlift', 98, 1, 330, 98],
    ['deadlift', 60, 3, 150, 60],
    ['deadlift', 60, 4, 120, 60],
    ['pushups', 60, 3, 14, 60],
    ['pushups', 60, 4, 11, 60],
    ['pushups', 100, 3, 61, 100],
    ['plank', 100, 3, 215 / 60, 100], // 3.583 min = 214.98 s, so 215 s is the shortest whole-second plank
    ['plank', 60, 3, 85 / 60, 60], // 1.416 min = 84.96 s, so 85 s
    ['sdc', 60, 3, 151 / 60, 60], // 2.517 min = 151.02 s, so 151 s
    ['sdc', 100, 3, 90 / 60, 100],
    ['tmr', 60, 3, 1185 / 60, 60], // 19.75 min = 1185 s exactly
    ['tmr', 100, 3, 805 / 60, 100], // 13.417 min = 805.02 s, so 805 s
  ])('%s: %i points in column %i needs %p and earns %i', (key, target, column, raw, earns) => {
    const need = rawNeeded(event(key), target, column);
    expect(need.raw).toBeCloseTo(raw, 9);
    expect(need.score).toBe(earns);
  });

  test('women 47-51 on the 2MR: 70 points is 21:45 and 71 points is 21:40 (official chart)', () => {
    // Column 14. These two rows were once swapped in the app; the official chart has 71 = 21:40 and 70 = 21:45.
    const seventy = rawNeeded(event('tmr'), 70, 14);
    expect(seventy.raw).toBeCloseTo(1305 / 60, 9);
    expect(seventy.score).toBe(70);
    const seventyOne = rawNeeded(event('tmr'), 71, 14);
    expect(seventyOne.raw).toBeCloseTo(1300 / 60, 9);
    expect(seventyOne.score).toBe(71);
  });

  test('women 57-61 on the 2MR: 19:15 earns 95 points (official chart)', () => {
    // Column 18, rows 98-95 are 18:05, 18:22, 18:37, 19:15. This column was once copied from the 52-56 group.
    expect(scoreFor(event('tmr'), min(19, 15), 18)).toBe(95);
    expect(scoreFor(event('tmr'), min(19, 16), 18)).toBe(94);
    expect(scoreFor(event('tmr'), min(18, 5), 18)).toBe(98);
    expect(scoreFor(event('tmr'), min(18, 6), 18)).toBe(97);
  });

  test('a target above 100 has no answer', () => {
    expect(rawNeeded(event('deadlift'), 101, 3)).toBeNull();
  });
});

describe('spreadPoints', () => {
  const scores = { deadlift: 81, pushups: 83, sdc: 88, plank: 74, tmr: 90 }; // total 416

  test('splits the gap as evenly as possible, earlier events taking the remainder', () => {
    // 450 - 416 = 34 points over 5 events: 7, 7, 7, 7, 6
    expect(spreadPoints(scores, 450)).toEqual({ deadlift: 7, pushups: 7, sdc: 7, plank: 7, tmr: 6 });
  });
  test('gains add up to exactly the gap', () => {
    const gains = spreadPoints(scores, 470);
    expect(Object.values(gains).reduce((a, b) => a + b, 0)).toBe(470 - 416);
  });
  test('an event never passes 100; the points move to the others', () => {
    const gains = spreadPoints({ deadlift: 100, pushups: 100, sdc: 100, plank: 100, tmr: 90 }, 500);
    expect(gains).toEqual({ deadlift: 0, pushups: 0, sdc: 0, plank: 0, tmr: 10 });
  });
  test('a target at or below the current total changes nothing', () => {
    expect(spreadPoints(scores, 416)).toEqual({ deadlift: 0, pushups: 0, sdc: 0, plank: 0, tmr: 0 });
    expect(spreadPoints(scores, 300)).toEqual({ deadlift: 0, pushups: 0, sdc: 0, plank: 0, tmr: 0 });
  });
  test('a target above 500 stops once every event is at 100', () => {
    const gains = spreadPoints(scores, 600);
    for (const key of Object.keys(scores)) expect(scores[key] + gains[key]).toBe(100);
  });
});

describe('formatting', () => {
  test('formatRaw', () => {
    expect(formatRaw(event('deadlift'), 262)).toBe('262 lbs');
    expect(formatRaw(event('pushups'), 40)).toBe('40 reps');
    expect(formatRaw(event('sdc'), 105 / 60)).toBe('1:45');
    expect(formatRaw(event('plank'), 130 / 60)).toBe('2:10');
    expect(formatRaw(event('tmr'), 605 / 60)).toBe('10:05'); // seconds are zero-padded
  });
  test('describeChange', () => {
    expect(describeChange(event('deadlift'), 250, 262)).toBe('+12 lbs');
    expect(describeChange(event('pushups'), 30, 38)).toBe('+8 reps');
    expect(describeChange(event('tmr'), 15.5, 15)).toBe('30 sec faster');
    expect(describeChange(event('tmr'), 15.5, 15.5 - 125 / 60)).toBe('2:05 faster');
    expect(describeChange(event('plank'), 2.5, 2.5 + 55 / 60)).toBe('55 sec longer');
    expect(describeChange(event('sdc'), 2, 2)).toBe('same');
  });
});
