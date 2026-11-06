// Army body-fat estimate from weight and abdominal (waist) circumference. These are the linear formulas the published
// tables were generated from; tests/bodyComposition.test.js checks them against every cell of the old lookup tables.
const FORMULAS = {
    male: { constant: -26.97, perPound: -0.12, perWaist: 1.99, maxWaist: 55 },
    female: { constant: -9.15, perPound: -0.015, perWaist: 1.27, maxWaist: 45 },
};

export const WEIGHT_RANGE = { min: 90, max: 250 };
export const MIN_WAIST = 25;
export const BODY_FAT_FLOOR = 10;
export const BODY_FAT_CEILING = 60;

export class BodyCompositionError extends Error {
    constructor(field, code, message) {
        super(message);
        this.name = 'BodyCompositionError';
        this.field = field;
        this.code = code;
    }
}

// The published tables round to the nearest whole percent, with an exact .5 going to the even neighbour.
const roundHalfEven = (value) => {
    const whole = Math.floor(value);
    if (value - whole === 0.5) return whole % 2 === 0 ? whole : whole + 1;
    return Math.round(value);
};

const parseNumber = (field, input) => {
    const text = String(input ?? '').trim();
    if (text === '') throw new BodyCompositionError(field, 'missing', `Enter a ${field}.`);
    const value = Number(text);
    if (!Number.isFinite(value)) throw new BodyCompositionError(field, 'not-a-number', `The ${field} must be a number.`);
    return value;
};

export function parseWeight(input) {
    const weight = parseNumber('weight', input);
    if (!Number.isInteger(weight)) {
        throw new BodyCompositionError('weight', 'not-whole', 'Weight must be a whole number of pounds.');
    }
    if (weight < WEIGHT_RANGE.min || weight > WEIGHT_RANGE.max) {
        throw new BodyCompositionError('weight', 'out-of-range', `Weight must be between ${WEIGHT_RANGE.min} and ${WEIGHT_RANGE.max} lbs.`);
    }
    return weight;
}

export function parseWaist(input, isMale) {
    const waist = parseNumber('waist', input);
    if (!Number.isInteger(waist * 2)) {
        throw new BodyCompositionError('waist', 'not-half-inch', 'Waist must be a whole number or end in .5.');
    }
    const maxWaist = FORMULAS[isMale ? 'male' : 'female'].maxWaist;
    if (waist < MIN_WAIST || waist > maxWaist) {
        throw new BodyCompositionError('waist', 'out-of-range', `Waist must be between ${MIN_WAIST} and ${maxWaist} in.`);
    }
    return waist;
}

// Returns { percent, display }. display matches the printed tables: "<10" and ">60" outside the table's range.
// Throws BodyCompositionError if an input is missing or outside the range the tables cover.
export function bodyFatPercent({ isMale, weight, waist }) {
    const parsedWeight = parseWeight(weight);
    const parsedWaist = parseWaist(waist, isMale);
    const { constant, perPound, perWaist } = FORMULAS[isMale ? 'male' : 'female'];
    const percent = roundHalfEven(constant + perPound * parsedWeight + perWaist * parsedWaist);
    const display = percent < BODY_FAT_FLOOR ? `<${BODY_FAT_FLOOR}`
        : percent > BODY_FAT_CEILING ? `>${BODY_FAT_CEILING}`
        : String(percent);
    return { percent, display };
}
