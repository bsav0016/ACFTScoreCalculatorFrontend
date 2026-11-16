import { isNetworkFailure } from '../components/networkError';

describe('isNetworkFailure', () => {
  test('recognises React Native being offline (a TypeError)', () => {
    expect(isNetworkFailure(new TypeError('Network request failed'))).toBe(true);
  });

  test('recognises a request aborted through an AbortController', () => {
    const abort = new Error('Aborted');
    abort.name = 'AbortError';
    expect(isNetworkFailure(abort)).toBe(true);
  });

  test("recognises the cancelled request Expo's native fetch reported to Sentry", () => {
    const error = new Error(
      'fetch failed: FetchRequestCanceledException: Fetch request has been canceled (at Expo/NativeResponse.swift:63)',
    );
    expect(isNetworkFailure(error)).toBe(true);
  });

  test("recognises other native fetch failures, whatever the reason", () => {
    expect(isNetworkFailure(new Error('fetch failed: The Internet connection appears to be offline.'))).toBe(true);
    expect(isNetworkFailure(new Error('Fetch failed: timed out'))).toBe(true);
  });

  test('does not hide real problems', () => {
    expect(isNetworkFailure(new SyntaxError('Unexpected end of JSON input'))).toBe(false);
    expect(isNetworkFailure(new Error("Cannot read properties of undefined (reading 'percentiles')"))).toBe(false);
    expect(isNetworkFailure(new Error('Something about a failed fetch of data'))).toBe(false);
    expect(isNetworkFailure(new Error('Request failed with status 500'))).toBe(false);
  });

  test('copes with nothing, and with things that are not errors', () => {
    expect(isNetworkFailure(undefined)).toBe(false);
    expect(isNetworkFailure(null)).toBe(false);
    expect(isNetworkFailure('fetch failed: x')).toBe(false);
    expect(isNetworkFailure({})).toBe(false);
  });
});
