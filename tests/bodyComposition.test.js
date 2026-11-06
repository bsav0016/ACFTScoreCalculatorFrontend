import { bodyFatPercent, BodyCompositionError } from '../components/BodyFatCalculator/bodyComposition';
import { maleBodyFatCalculations } from '../components/BodyFatCalculator/CalculationDicts/maleBodyFatCalculations';
import { femaleBodyFatCalculations } from '../components/BodyFatCalculator/CalculationDicts/femaleBodyFatCalculations';

// The module must reproduce the lookup tables exactly before they are deleted.
describe.each([
  ['male', true, maleBodyFatCalculations],
  ['female', false, femaleBodyFatCalculations],
])('%s: module vs lookup table', (_, isMale, table) => {
  test('every cell matches', () => {
    const wrong = [];
    let cells = 0;
    for (const weight of Object.keys(table)) {
      for (const [waist, cell] of Object.entries(table[weight])) {
        cells += 1;
        const { display } = bodyFatPercent({ isMale, weight: Number(weight), waist: Number(waist) });
        if (display !== cell) wrong.push(`${weight} lb / ${waist} in: table ${cell}, module ${display}`);
      }
    }
    expect(cells).toBeGreaterThan(6000);
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
      String(maleBodyFatCalculations[180][34.5]),
    );
    expect(bodyFatPercent({ isMale: true, weight: ' 180 ', waist: '34' }).display).toBe(maleBodyFatCalculations[180][34]);
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
