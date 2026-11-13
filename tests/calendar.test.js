import {
  todayParts, daysInMonth, monthGrid, addMonths, isAfter, canShowMonth, clampDay, formatPickedDate,
} from '../components/Calculator/calendar';

describe('todayParts', () => {
  test('reads the local date with a 1-based month', () => {
    expect(todayParts(new Date(2026, 10, 12, 23, 59))).toEqual({ year: 2026, month: 11, day: 12 });
    expect(todayParts(new Date(2027, 0, 1, 0, 0))).toEqual({ year: 2027, month: 1, day: 1 });
  });
  test('defaults to now', () => {
    const t = todayParts();
    expect(t.month).toBeGreaterThanOrEqual(1);
    expect(t.month).toBeLessThanOrEqual(12);
  });
});

describe('daysInMonth', () => {
  test('handles 28, 29, 30 and 31 day months', () => {
    expect(daysInMonth(2025, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe('monthGrid', () => {
  test('November 2026 starts on a Sunday and fills five weeks', () => {
    const weeks = monthGrid(2026, 11);
    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(weeks[4]).toEqual([29, 30, null, null, null, null, null]);
  });
  test('pads the first week with blanks when the month starts mid-week', () => {
    const weeks = monthGrid(2026, 10); // October 1, 2026 is a Thursday
    expect(weeks[0]).toEqual([null, null, null, null, 1, 2, 3]);
  });
  test('every week has seven cells and every day appears once', () => {
    for (const [year, month] of [[2026, 2], [2028, 2], [2026, 8], [2027, 5]]) {
      const weeks = monthGrid(year, month);
      expect(weeks.every((w) => w.length === 7)).toBe(true);
      const days = weeks.flat().filter((d) => d !== null);
      expect(days).toEqual(Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1));
    }
  });
});

describe('addMonths', () => {
  test('moves within and across years', () => {
    expect(addMonths({ year: 2026, month: 5 }, 1)).toEqual({ year: 2026, month: 6 });
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(addMonths({ year: 2026, month: 3 }, -15)).toEqual({ year: 2024, month: 12 });
  });
});

describe('future dates', () => {
  const today = { year: 2026, month: 11, day: 12 };
  test('isAfter compares whole dates', () => {
    expect(isAfter({ year: 2026, month: 11, day: 13 }, today)).toBe(true);
    expect(isAfter({ year: 2026, month: 11, day: 12 }, today)).toBe(false);
    expect(isAfter({ year: 2026, month: 10, day: 31 }, today)).toBe(false);
    expect(isAfter({ year: 2027, month: 1, day: 1 }, today)).toBe(true);
  });
  test('canShowMonth blocks months after the current one and years before the minimum', () => {
    expect(canShowMonth({ year: 2026, month: 11 }, today, 2022)).toBe(true);
    expect(canShowMonth({ year: 2026, month: 12 }, today, 2022)).toBe(false);
    expect(canShowMonth({ year: 2027, month: 1 }, today, 2022)).toBe(false);
    expect(canShowMonth({ year: 2022, month: 1 }, today, 2022)).toBe(true);
    expect(canShowMonth({ year: 2021, month: 12 }, today, 2022)).toBe(false);
  });
  test('clampDay shortens to the month and stops at today', () => {
    expect(clampDay(31, { year: 2026, month: 2 }, today)).toBe(28);
    expect(clampDay(31, { year: 2026, month: 4 }, today)).toBe(30);
    expect(clampDay(31, { year: 2026, month: 11 }, today)).toBe(12);
    expect(clampDay(5, { year: 2026, month: 11 }, today)).toBe(5);
    expect(clampDay(0, { year: 2026, month: 3 }, today)).toBe(1);
  });
});

describe('formatPickedDate', () => {
  test('spells the month', () => {
    expect(formatPickedDate({ year: 2026, month: 11, day: 3 })).toBe('November 3, 2026');
  });
});
