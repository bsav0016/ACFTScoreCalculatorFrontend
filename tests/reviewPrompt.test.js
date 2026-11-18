import { askForReviewIfDue, shouldAskForReview, MIN_DAYS_BETWEEN, STORAGE_KEY } from '../components/Calculator/reviewPrompt';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 17);

function fakes({ last, available = true, hasAction = true, failStore = false } = {}) {
  const data = last === undefined ? {} : { [STORAGE_KEY]: String(last) };
  const calls = [];
  return {
    data,
    calls,
    store: {
      get: async (key) => {
        if (failStore) throw new Error('storage down');
        return data[key] ?? null;
      },
      set: async (key, value) => {
        data[key] = value;
      },
    },
    review: {
      isAvailableAsync: async () => available,
      hasAction: () => hasAction,
      requestReview: async () => {
        calls.push('asked');
      },
    },
  };
}

test('asks the first time, then waits the minimum number of days', () => {
  expect(shouldAskForReview(null, NOW)).toBe(true);
  expect(shouldAskForReview(NOW - (MIN_DAYS_BETWEEN - 1) * DAY, NOW)).toBe(false);
  expect(shouldAskForReview(NOW - MIN_DAYS_BETWEEN * DAY, NOW)).toBe(true);
  expect(shouldAskForReview(NOW + DAY, NOW)).toBe(false);
});

test('a first request asks and remembers when', async () => {
  const f = fakes();
  expect(await askForReviewIfDue({ ...f, now: NOW })).toBe(true);
  expect(f.calls).toEqual(['asked']);
  expect(f.data[STORAGE_KEY]).toBe(String(NOW));
});

test('a second request soon after does not ask again', async () => {
  const f = fakes({ last: NOW - 10 * DAY });
  expect(await askForReviewIfDue({ ...f, now: NOW })).toBe(false);
  expect(f.calls).toEqual([]);
});

test('nothing is recorded when the store cannot show a prompt', async () => {
  const f = fakes({ available: false });
  expect(await askForReviewIfDue({ ...f, now: NOW })).toBe(false);
  expect(f.data[STORAGE_KEY]).toBeUndefined();
  const g = fakes({ hasAction: false });
  expect(await askForReviewIfDue({ ...g, now: NOW })).toBe(false);
});

test('a storage failure never throws and never asks', async () => {
  const f = fakes({ failStore: true });
  await expect(askForReviewIfDue({ ...f, now: NOW })).resolves.toBe(false);
  expect(f.calls).toEqual([]);
});
