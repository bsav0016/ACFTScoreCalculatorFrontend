import { describeSaveResult, validateTestDate, STORED_MESSAGE } from '../components/Calculator/saveScore';

describe('validateTestDate', () => {
  // The date dialog starts with numbers (day 1, month 1, year 2024) and holds strings once a field is edited. The old
  // check treated an integer as invalid, so leaving the defaults untouched was refused.
  test('accepts the dialog defaults, which are numbers', () => {
    expect(validateTestDate({ day: 1, month: 1, year: 2024 })).toBeNull();
  });

  test('accepts typed values, which are strings', () => {
    expect(validateTestDate({ day: '15', month: '7', year: '2025' })).toBeNull();
    expect(validateTestDate({ day: ' 31 ', month: '12', year: '2022' })).toBeNull();
  });

  test.each([
    ['blank', ''],
    ['zero', '0'],
    ['too big', '32'],
    ['a decimal', '1.5'],
    ['a negative', '-3'],
    ['text', 'ten'],
    ['null', null],
    ['a fractional number', 2.5],
  ])('refuses a day that is %s', (_, day) => {
    expect(validateTestDate({ day, month: '5', year: '2025' })).toMatch(/^Day /);
  });

  test.each(['', '0', '13', '1.5', 'May'])('refuses month %p', (month) => {
    expect(validateTestDate({ day: '5', month, year: '2025' })).toMatch(/^Month /);
  });

  test.each(['', '2021', '24', '20.5', 'abc'])('refuses year %p', (year) => {
    expect(validateTestDate({ day: '5', month: '5', year })).toMatch(/^Year /);
  });

  test('refuses dates that are not on the calendar', () => {
    expect(validateTestDate({ day: '30', month: '2', year: '2025' })).toBe('That date does not exist.');
    expect(validateTestDate({ day: '31', month: '4', year: '2025' })).toBe('That date does not exist.');
    expect(validateTestDate({ day: '29', month: '2', year: '2025' })).toBe('That date does not exist.');
  });

  test('accepts 29 February in a leap year', () => {
    expect(validateTestDate({ day: '29', month: '2', year: '2024' })).toBeNull();
  });
});

describe('describeSaveResult', () => {
  test('reports success when the server confirms the score was stored', () => {
    expect(describeSaveResult({ status: 200, ok: true, body: { message: STORED_MESSAGE } }))
      .toEqual({ type: 'success', message: 'Score saved.' });
  });

  test("passes on the server's reason when it refuses the score", () => {
    expect(describeSaveResult({ status: 400, ok: false, body: { message: 'Invalid score data' } }))
      .toEqual({ type: 'error', message: 'Invalid score data' });
  });

  test('asks the user to log in again after a 401 or 403, whatever the body says', () => {
    for (const status of [401, 403]) {
      const result = describeSaveResult({ status, ok: false, body: { detail: 'Invalid token.' } });
      expect(result).toEqual({ type: 'error', message: 'Please log in again to save your score.' });
    }
  });

  test('says so when the server cannot be reached', () => {
    const result = describeSaveResult({ networkError: true });
    expect(result.type).toBe('error');
    expect(result.message).toMatch(/connection/i);
  });

  test('falls back to a generic error when the answer is not JSON (for example a 500 page)', () => {
    expect(describeSaveResult({ status: 500, ok: false, body: null }))
      .toEqual({ type: 'error', message: 'Something went wrong saving your score. Please try again.' });
  });

  test('never reports success without the confirmation message', () => {
    expect(describeSaveResult({ status: 200, ok: true, body: { message: 'something else' } }).type).toBe('error');
    expect(describeSaveResult({ status: 200, ok: true, body: null }).type).toBe('error');
    expect(describeSaveResult().type).toBe('error');
  });

  test('does not call a refused request a success even if the message matches', () => {
    expect(describeSaveResult({ status: 400, ok: false, body: { message: STORED_MESSAGE } }).type).toBe('error');
  });
});
