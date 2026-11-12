import {
  buildProgress, formatTime, byDateAscending, byDateDescending, AFT_EVENTS, AFT_MAX_TOTAL,
} from '../components/AcftResults/progress';

let nextId = 1;
const aft = (year, month, day, scores, extra = {}) => {
  const [deadlift, pushups, sdc, plank, tmr] = scores;
  return {
    id: nextId++, standard: 'AFT', year, month, day,
    deadlift_score: deadlift, pushups_score: pushups, sdc_score: sdc, plank_score: plank, tmr_score: tmr,
    total_score: scores.reduce((a, b) => a + b, 0), table_version: 'v1', ...extra,
  };
};
const acft = (year, month, day, total) => ({
  id: nextId++, standard: 'ACFT', year, month, day, total_score: total,
  deadlift_score: 80, spt_score: 80, pushups_score: 80, sdc_score: 80, plank_score: 80, tmr_score: 80,
});

describe('formatTime', () => {
  test('AFT raw is plain seconds', () => {
    expect(formatTime(105, 'AFT')).toBe('1:45');
    expect(formatTime(960, 'AFT')).toBe('16:00');
    expect(formatTime(59, 'AFT')).toBe('0:59');
  });
  test('ACFT raw joins minutes*60 with the seconds text', () => {
    expect(formatTime(6045, 'ACFT')).toBe('1:45');
    expect(formatTime(60000, 'ACFT')).toBe('10:00');
  });
});

describe('ordering', () => {
  test('sorts by date and breaks same-day ties by id', () => {
    const a = aft(2026, 5, 1, [60, 60, 60, 60, 60]);
    const b = aft(2026, 5, 1, [70, 70, 70, 70, 70]);
    const c = aft(2025, 12, 31, [50, 50, 50, 50, 50]);
    expect([b, a, c].sort(byDateAscending)).toEqual([c, a, b]);
    expect([a, b, c].sort(byDateDescending)).toEqual([b, a, c]);
  });
});

describe('buildProgress', () => {
  test('empty, missing and non-array input', () => {
    for (const input of [[], undefined, null]) {
      const p = buildProgress(input);
      expect(p.aft).toEqual([]);
      expect(p.latest).toBeNull();
      expect(p.previous).toBeNull();
      expect(p.totalDelta).toBeNull();
      expect(p.bestTotal).toBeNull();
      expect(p.weakest).toBeNull();
      expect(p.series).toEqual([]);
      expect(p.comparable).toBe(true);
    }
  });

  test('one result has a latest but no deltas', () => {
    const r = aft(2026, 3, 1, [90, 80, 70, 60, 50]);
    const p = buildProgress([r]);
    expect(p.latest).toBe(r);
    expect(p.previous).toBeNull();
    expect(p.totalDelta).toBeNull();
    expect(AFT_EVENTS.every(({ key }) => p.eventDeltas[key] === null)).toBe(true);
    expect(p.bestTotal).toBe(r);
    expect(p.weakest).toEqual({ key: 'tmr', label: '2MR', score: 50 });
  });

  test('computes total and per-event deltas against the previous test', () => {
    const first = aft(2026, 1, 10, [60, 70, 80, 90, 70]);
    const second = aft(2026, 4, 10, [75, 70, 70, 95, 80]);
    const p = buildProgress([second, first]);
    expect(p.latest).toBe(second);
    expect(p.previous).toBe(first);
    expect(p.totalDelta).toBe(second.total_score - first.total_score);
    expect(p.eventDeltas).toEqual({ deadlift: 15, pushups: 0, sdc: -10, plank: 5, tmr: 10 });
    expect(p.series).toEqual([
      { id: first.id, total: first.total_score },
      { id: second.id, total: second.total_score },
    ]);
  });

  test('personal bests per event keep the result they came from; earliest wins ties', () => {
    const a = aft(2026, 1, 1, [90, 50, 60, 70, 80]);
    const b = aft(2026, 2, 1, [80, 70, 60, 75, 85]);
    const c = aft(2026, 3, 1, [90, 65, 55, 70, 60]);
    const p = buildProgress([c, a, b]);
    expect(p.bests.deadlift).toEqual({ score: 90, result: a });
    expect(p.bests.pushups).toEqual({ score: 70, result: b });
    expect(p.bests.sdc.result).toBe(a);
    expect(p.bests.plank.result).toBe(b);
    expect(p.bests.tmr.result).toBe(b);
    expect(p.bestTotal).toBe(b);
  });

  test('weakest event comes from the latest result, first in list order on a tie', () => {
    const old = aft(2026, 1, 1, [10, 90, 90, 90, 90]);
    const latest = aft(2026, 2, 1, [80, 60, 60, 90, 90]);
    expect(buildProgress([old, latest]).weakest).toEqual({ key: 'pushups', label: 'T-Push Ups', score: 60 });
  });

  test('ACFT results are kept out of trends and listed newest first', () => {
    const a = aft(2026, 1, 1, [60, 60, 60, 60, 60]);
    const old1 = acft(2024, 5, 1, 450);
    const old2 = acft(2025, 5, 1, 500);
    const p = buildProgress([old1, a, old2]);
    expect(p.aft).toEqual([a]);
    expect(p.acft).toEqual([old2, old1]);
    expect(p.series).toHaveLength(1);
    expect(p.bestTotal).toBe(a);
  });

  test('only ACFT results leaves nothing to trend', () => {
    const p = buildProgress([acft(2024, 5, 1, 450)]);
    expect(p.latest).toBeNull();
    expect(p.acft).toHaveLength(1);
  });

  test('flags totals scored on different table versions, blank counted as one group', () => {
    const same1 = aft(2026, 1, 1, [60, 60, 60, 60, 60]);
    const same2 = aft(2026, 2, 1, [70, 70, 70, 70, 70]);
    expect(buildProgress([same1, same2]).comparable).toBe(true);

    const older = aft(2025, 1, 1, [60, 60, 60, 60, 60], { table_version: 'v0' });
    expect(buildProgress([older, same2]).comparable).toBe(false);

    const blank1 = aft(2025, 1, 1, [60, 60, 60, 60, 60], { table_version: '' });
    const blank2 = aft(2025, 2, 1, [60, 60, 60, 60, 60], { table_version: null });
    expect(buildProgress([blank1, blank2]).comparable).toBe(true);
    expect(buildProgress([blank1, same2]).comparable).toBe(false);
  });

  test('does not mutate its input', () => {
    const input = [aft(2026, 3, 1, [60, 60, 60, 60, 60]), aft(2026, 1, 1, [60, 60, 60, 60, 60])];
    const copy = [...input];
    buildProgress(input);
    expect(input).toEqual(copy);
  });

  test('AFT maximum is 500', () => {
    expect(AFT_MAX_TOTAL).toBe(500);
  });
});
