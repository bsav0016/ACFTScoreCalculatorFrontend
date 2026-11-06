import anchors from './fixtures/body-fat-anchors.json';
import { bodyFatPercent, BodyCompositionError } from '../components/BodyFatCalculator/bodyComposition';

// Values copied from the lookup tables this module replaced (see the fixture's note). The module was checked against
// every cell of both tables before they were deleted; these anchors keep corners, the "<10"/">60" boundaries and the
// exact-.5 rounding cells under test.
describe.each([
  ['male', true],
  ['female', false],
])('%s: module vs recorded table values', (sex, isMale) => {
  test.each(['anchors', 'ties', 'clamps'])('%s', (group) => {
    const rows = anchors[sex][group];
    // The female table never reaches "<10" or ">60", so it has no clamp cells.
    if (group === 'clamps' && !isMale) return expect(rows).toEqual([]);
    expect(rows.length).toBeGreaterThan(0);
    const wrong = rows
      .filter(([weight, waist, cell]) => bodyFatPercent({ isMale, weight, waist }).display !== cell)
      .map(([weight, waist, cell]) => `${weight} lb / ${waist} in: table ${cell}`);
    expect(wrong).toEqual([]);
  });
});

const errorOf = (input) => {
  try {
    bodyFatPercent(input);
  } catch (error) {
    return error;
  }
  return null;
};

describe('input validation', () => {
  test('accepts the text a form field produces, including half inches', () => {
    expect(bodyFatPercent({ isMale: true, weight: '180', waist: '34.5' }).display).toBe(
      '20',
    );
    expect(bodyFatPercent({ isMale: true, weight: ' 180 ', waist: '34' }).display).toBe('19');
  });

  test.each([
    ['', '34', 'weight', 'missing'],
    ['abc', '34', 'weight', 'not-a-number'],
    ['180.5', '34', 'weight', 'not-whole'],
    ['89', '34', 'weight', 'out-of-range'],
    ['251', '34', 'weight', 'out-of-range'],
    ['180', '', 'waist', 'missing'],
    ['180', '34abc', 'waist', 'not-a-number'],
    ['180', '34.3', 'waist', 'not-half-inch'],
    ['180', '24.5', 'waist', 'out-of-range'],
    ['180', '55.5', 'waist', 'out-of-range'],
  ])('weight %j, waist %j -> %s %s', (weight, waist, field, code) => {
    const error = errorOf({ isMale: true, weight, waist });
    expect(error).toBeInstanceOf(BodyCompositionError);
    expect({ field: error.field, code: error.code }).toEqual({ field, code });
  });

  test('the waist limit depends on sex (the female table stops at 45 in.)', () => {
    expect(errorOf({ isMale: true, weight: 150, waist: 50 })).toBeNull();
    expect(errorOf({ isMale: false, weight: 150, waist: 45 })).toBeNull();
    expect(errorOf({ isMale: false, weight: 150, waist: 45.5 })).toMatchObject({ field: 'waist', code: 'out-of-range' });
  });
});
