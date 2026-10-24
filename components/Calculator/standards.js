// Which scale the app scores against and when it was last checked against the Army's published standards. Both come
// from the shared table file (data/aft_tables_250601.json, generated in the backend), so the home screen cannot say
// one date while the tables say another.
import tables from '../../data/aft_tables_250601.json';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const TABLE_VERSION = tables.version;
export const STANDARDS_AS_OF = tables.standards_as_of;

/** '2026-07-07' -> '7 July 2026'. Built from the parts, so the phone's time zone and locale cannot change it. */
export function formatStandardsDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName || Number(day) < 1 || Number(day) > 31) throw new Error(`Not a calendar date: ${iso}`);
  return `${Number(day)} ${monthName} ${year}`;
}

export const standardsLine = () => `Current as of ${formatStandardsDate(STANDARDS_AS_OF)}`;
