import { buildShareMessage, canShareScores, shareLink } from '../components/Calculator/shareScore';

const all = { deadlift: 95, pushups: 88, sdc: 92, plank: 90, tmr: 98, total: 463 };

test('a finished score becomes a short message with the total, each event and a link', () => {
  const message = buildShareMessage(all, 'ios');
  const lines = message.split('\n');
  expect(lines[0]).toBe('I scored 463/500 on the Army Fitness Test.');
  expect(lines[1]).toBe('Deadlift 95 | T-Push Ups 88 | SDC 92 | Plank 90 | 2MR 98');
  expect(lines[2]).toMatch(/^Check yours with the free AFT Score Calculator: https:\/\/apps\.apple\.com\//);
});

test('each phone gets its own store, tagged as a share', () => {
  expect(shareLink('ios')).toMatch(/apps\.apple\.com.*ct=share-ios/);
  expect(shareLink('android')).toMatch(/play\.google\.com.*utm_campaign%3Dshare-android/);
  expect(buildShareMessage(all, 'android')).toContain('play.google.com');
});

test('nothing is shared until all five events and the total are in', () => {
  expect(canShareScores(all)).toBe(true);
  for (const key of Object.keys(all)) {
    const partial = { ...all };
    delete partial[key];
    expect(canShareScores(partial)).toBe(false);
    expect(buildShareMessage(partial, 'ios')).toBeNull();
  }
  expect(buildShareMessage({}, 'ios')).toBeNull();
});

test('a zero score still counts as entered', () => {
  expect(canShareScores({ ...all, plank: 0 })).toBe(true);
});

test('the message holds no age, name or account detail', () => {
  const message = buildShareMessage({ ...all, age: 31, name: 'Pat', email: 'a@b.c' }, 'ios');
  expect(message).not.toMatch(/31|Pat|a@b\.c/);
});
