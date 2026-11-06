import { maleBodyFatCalculations } from '../components/BodyFatCalculator/CalculationDicts/maleBodyFatCalculations';
import { femaleBodyFatCalculations } from '../components/BodyFatCalculator/CalculationDicts/femaleBodyFatCalculations';

// The body-fat tables are the Army's published linear formulas, tabulated to whole percent:
//   male   %BF = -26.97 - 0.12 * weight + 1.99 * waist
//   female %BF = -9.15  - 0.015 * weight + 1.27 * waist
// The published tables were produced by evaluating the formula in double precision and rounding half to even, so the
// cells where the formula lands exactly on .5 follow floating-point noise (male 102 lb / 29 in -> 18, 101 lb / 41 in -> 43).
// The test reproduces that exactly; an exact-decimal formula would disagree on about 0.2% of cells.
const FORMULAS = {
  male: { table: maleBodyFatCalculations, constant: -26.97, perPound: -0.12, perWaist: 1.99, firstWaist: 25, lastWaist: 55 },
  female: { table: femaleBodyFatCalculations, constant: -9.15, perPound: -0.015, perWaist: 1.27, firstWaist: 25, lastWaist: 45 },
};

const roundHalfEven = (value) => {
  const whole = Math.floor(value);
  if (value - whole === 0.5) return whole % 2 === 0 ? whole : whole + 1;
  return Math.round(value);
};

const formula = ({ constant, perPound, perWaist }, weight, waist) =>
  roundHalfEven(constant + perPound * weight + perWaist * waist);

describe.each(Object.keys(FORMULAS))('%s body-fat table', (sex) => {
  const spec = FORMULAS[sex];
  const { table } = spec;

  test('covers weights 90-250 lb, one row each', () => {
    expect(Object.keys(table).map(Number)).toEqual(Array.from({ length: 161 }, (_, i) => 90 + i));
  });

  test('every row has every half-inch waist from first to last, and nothing else', () => {
    const expected = [];
    for (let waist = spec.firstWaist; waist <= spec.lastWaist; waist += 0.5) expected.push(waist);
    for (const weight of Object.keys(table)) {
      const waists = Object.keys(table[weight]).map(Number).sort((a, b) => a - b);
      expect({ weight, waists }).toEqual({ weight, waists: expected });
    }
  });

  test('every numeric cell equals the formula', () => {
    const wrong = [];
    for (const weight of Object.keys(table)) {
      for (const [waist, cell] of Object.entries(table[weight])) {
        if (/[<>]/.test(cell)) continue;
        if (Number(cell) !== formula(spec, Number(weight), Number(waist))) wrong.push(`${weight} lb / ${waist} in: ${cell}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  test('a "<" or ">" cell is only used where the formula is outside the printed range', () => {
    const wrong = [];
    for (const weight of Object.keys(table)) {
      for (const [waist, cell] of Object.entries(table[weight])) {
        const m = /^([<>])(\d+)$/.exec(cell);
        if (!m) continue;
        const value = formula(spec, Number(weight), Number(waist));
        const limit = Number(m[2]);
        const ok = m[1] === '<' ? value <= limit : value >= limit;
        if (!ok) wrong.push(`${weight} lb / ${waist} in: ${cell} vs ${value}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
