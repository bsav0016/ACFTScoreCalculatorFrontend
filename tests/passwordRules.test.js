import { PASSWORD_MAX, PASSWORD_MIN, newPasswordProblem, serverPasswordMessage } from '../components/passwordRules';

describe('newPasswordProblem', () => {
  test('accepts a reasonable password', () => {
    expect(newPasswordProblem('harbor-light-77', 'harbor-light-77')).toBeNull();
  });

  test('the minimum length is a boundary', () => {
    expect(newPasswordProblem('a'.repeat(PASSWORD_MIN - 1))).toMatch(/at least 8/);
    expect(newPasswordProblem('a'.repeat(PASSWORD_MIN))).toBeNull();
  });

  test('the maximum length is a boundary', () => {
    expect(newPasswordProblem('a'.repeat(PASSWORD_MAX))).toBeNull();
    expect(newPasswordProblem('a'.repeat(PASSWORD_MAX + 1))).toMatch(/no more than/);
  });

  test('all digits are refused', () => {
    expect(newPasswordProblem('12345678')).toMatch(/only numbers/);
    expect(newPasswordProblem('1234567a')).toBeNull();
  });

  test('a mismatched confirmation is refused, and none given skips the check', () => {
    expect(newPasswordProblem('harbor-light-77', 'harbor-light-78')).toMatch(/must match/);
    expect(newPasswordProblem('harbor-light-77')).toBeNull();
  });

  test('length is reported before a mismatch', () => {
    expect(newPasswordProblem('short', 'other')).toMatch(/at least/);
  });
});

describe('serverPasswordMessage', () => {
  test('joins the server messages', () => {
    expect(serverPasswordMessage(['Too common.', 'Entirely numeric.'])).toBe('Too common.\nEntirely numeric.');
  });

  test('has a fallback when there are none', () => {
    expect(serverPasswordMessage([])).toMatch(/not allowed/);
    expect(serverPasswordMessage(undefined)).toMatch(/not allowed/);
  });
});
