import screeningTable from '../../data/height_weight_screening.json';

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

export const AGE_RANGE = { min: 1, max: 99 };
const MIN_HEIGHT = { male: 60, female: 58 };
export const MAX_HEIGHT = 80;
// Upper age of each maximum-weight column, in the order the table lists them after the minimum weight.
const AGE_BAND_LIMITS = [20, 27, 39];

export function parseAge(input) {
    const age = parseNumber('age', input);
    if (!Number.isInteger(age)) throw new BodyCompositionError('age', 'not-whole', 'Age must be a whole number.');
    if (age < AGE_RANGE.min || age > AGE_RANGE.max) {
        throw new BodyCompositionError('age', 'out-of-range', `Age must be between ${AGE_RANGE.min} and ${AGE_RANGE.max}.`);
    }
    return age;
}

export function parseHeight(input, isMale) {
    const height = parseNumber('height', input);
    if (!Number.isInteger(height)) throw new BodyCompositionError('height', 'not-whole', 'Height must be a whole number of inches.');
    const min = MIN_HEIGHT[isMale ? 'male' : 'female'];
    if (height < min || height > MAX_HEIGHT) {
        throw new BodyCompositionError('height', 'out-of-range', `Height must be between ${min} and ${MAX_HEIGHT} in.`);
    }
    return height;
}

// Returns { min, max } screening weights in pounds for the person's height and age band.
// Throws BodyCompositionError if an input is missing or outside the table.
export function screeningWeights({ isMale, age, height }) {
    const parsedAge = parseAge(age);
    const parsedHeight = parseHeight(height, isMale);
    const row = screeningTable[isMale ? 'male' : 'female'][parsedHeight];
    const band = AGE_BAND_LIMITS.findIndex((limit) => parsedAge <= limit);
    return { min: row[0], max: row[band === -1 ? AGE_BAND_LIMITS.length + 1 : band + 1] };
}
