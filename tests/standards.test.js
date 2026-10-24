import { STANDARDS_AS_OF, TABLE_VERSION, formatStandardsDate, standardsLine } from '../components/Calculator/standards';
import { describeBuild } from '../components/buildLabel';
import tables from '../data/aft_tables_250601.json';

const app = require('../app.json').expo;

describe('formatStandardsDate', () => {
  test('writes the day without a leading zero, the month in full and the year', () => {
    expect(formatStandardsDate('2026-07-07')).toBe('7 July 2026');
    expect(formatStandardsDate('2025-06-01')).toBe('1 June 2025');
    expect(formatStandardsDate('2027-12-31')).toBe('31 December 2027');
  });

  test('is not changed by the phone\'s time zone', () => {
    const original = process.env.TZ;
    for (const zone of ['Pacific/Kiritimati', 'Pacific/Pago_Pago', 'UTC']) {
      process.env.TZ = zone;
      expect(formatStandardsDate('2026-01-01')).toBe('1 January 2026');
    }
    process.env.TZ = original;
  });

  test('rejects anything that is not an ISO calendar date', () => {
    for (const bad of [undefined, null, '', '7 July 2026', '2026-7-7', '2026-13-01', '2026-00-10', '2026-07-00', '2026-07-32']) {
      expect(() => formatStandardsDate(bad)).toThrow();
    }
  });
});

describe('the date and version the app shows come from the shared table file', () => {
  test('the file carries a version and an ISO date', () => {
    expect(tables.version).toBe(TABLE_VERSION);
    expect(tables.standards_as_of).toBe(STANDARDS_AS_OF);
    expect(() => formatStandardsDate(STANDARDS_AS_OF)).not.toThrow();
  });

  test('the home screen line is built from that date', () => {
    expect(standardsLine()).toBe(`Current as of ${formatStandardsDate(tables.standards_as_of)}`);
  });

  test('the store description in app.json says the same date, so it cannot drift', () => {
    expect(app.description).toContain(formatStandardsDate(STANDARDS_AS_OF));
  });
});

describe('describeBuild', () => {
  test('a build running its own bundled code', () => {
    expect(describeBuild({ appVersion: '3.3.0', tableVersion: '250601', updateId: null, updatesEnabled: true }))
      .toBe('Version 3.3.0 · Tables 250601 · Built-in');
  });

  test('a build running an over-the-air update shows its short id', () => {
    expect(describeBuild({
      appVersion: '3.3.0', tableVersion: '250601', updatesEnabled: true,
      updateId: '0195f3a2-77d1-4c5e-9a0b-2f6d3c1e8b44',
    })).toBe('Version 3.3.0 · Tables 250601 · Update 0195f3a2');
  });

  test('a development build, where updates are off, never shows an id', () => {
    expect(describeBuild({ appVersion: '3.3.0', tableVersion: '250601', updateId: 'abcdef123456', updatesEnabled: false }))
      .toBe('Version 3.3.0 · Tables 250601 · Built-in');
  });

  test('leaves out the version when the app cannot report one', () => {
    expect(describeBuild({ tableVersion: '250601', updateId: null, updatesEnabled: true }))
      .toBe('Tables 250601 · Built-in');
  });
});
