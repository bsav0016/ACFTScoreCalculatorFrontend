import fs from 'fs';
import path from 'path';
import table from '../data/height_weight_screening.json';
import { screeningWeights, BodyCompositionError } from '../components/BodyFatCalculator/bodyComposition';

describe.each([
  ['male', true, 60],
  ['female', false, 58],
])('%s height/weight screening', (sex, isMale, minHeight) => {
  const rows = table[sex];

  test('has one row per inch from the minimum height to 80', () => {
    expect(Object.keys(rows).map(Number)).toEqual(Array.from({ length: 80 - minHeight + 1 }, (_, i) => minHeight + i));
  });

  test('each row is [min, four maxima], whole numbers, and sane', () => {
    for (const [height, row] of Object.entries(rows)) {
      expect(row).toHaveLength(5);
      row.forEach((value) => expect(Number.isInteger(value)).toBe(true));
      expect({ height, ok: row[0] < row[1] }).toEqual({ height, ok: true });
      // The allowed maximum never falls as age increases.
      for (let i = 2; i < 5; i++) expect({ height, ok: row[i] >= row[i - 1] }).toEqual({ height, ok: true });
    }
  });

  test('weights rise with height in every column', () => {
    const heights = Object.keys(rows).map(Number);
    for (let i = 1; i < heights.length; i++) {
      for (let c = 0; c < 5; c++) {
        expect({ height: heights[i], c, ok: rows[heights[i]][c] > rows[heights[i - 1]][c] }).toEqual({ height: heights[i], c, ok: true });
      }
    }
  });

  test('screeningWeights picks the right column for each age band', () => {
    const row = rows[66];
    const cases = [[17, 1], [20, 1], [21, 2], [27, 2], [28, 3], [39, 3], [40, 4], [99, 4]];
    for (const [age, column] of cases) {
      expect(screeningWeights({ isMale, age: String(age), height: '66' })).toEqual({ min: row[0], max: row[column] });
    }
  });
});

test('the file names its source', () => {
  expect(table.source.title).toMatch(/AR 600-9/);
  expect(table.source.url).toMatch(/^https:/);
  expect(fs.existsSync(path.join(__dirname, '..', 'data', 'height_weight_screening.json'))).toBe(true);
});

describe('validation', () => {
  const errorOf = (input) => {
    try { screeningWeights(input); } catch (error) { return error; }
    return null;
  };

  test.each([
    [true, '', '66', 'age', 'missing'],
    [true, '25.5', '66', 'age', 'not-whole'],
    [true, '0', '66', 'age', 'out-of-range'],
    [true, '100', '66', 'age', 'out-of-range'],
    [true, '25', '', 'height', 'missing'],
    [true, '25', '66.5', 'height', 'not-whole'],
    [true, '25', '59', 'height', 'out-of-range'],
    [false, '25', '57', 'height', 'out-of-range'],
    [true, '25', '81', 'height', 'out-of-range'],
    [true, '25', '66abc', 'height', 'not-a-number'],
  ])('male=%s age %j height %j -> %s %s', (isMale, age, height, field, code) => {
    const error = errorOf({ isMale, age, height });
    expect(error).toBeInstanceOf(BodyCompositionError);
    expect({ field: error.field, code: error.code }).toEqual({ field, code });
  });

  test('females may be 58-59 in.', () => {
    expect(errorOf({ isMale: false, age: '25', height: '58' })).toBeNull();
  });
});
