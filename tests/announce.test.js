import { EMPTY_SNAPSHOT, SPOKEN_NAMES, buildAnnouncement } from '../components/Calculator/announce';
import { EVENTS } from '../components/Calculator/aftScoring';

const keys = ['deadlift', 'pushups', 'sdc', 'plank', 'tmr'];
const snap = (scores = {}) => ({
  scores: { deadlift: 0, pushups: 0, sdc: 0, plank: 0, tmr: 0, ...scores },
  entered: Object.fromEntries(keys.map(key => [key, scores[key] !== undefined])),
});

describe('buildAnnouncement', () => {
  test('first event entered: says that event only', () => {
    expect(buildAnnouncement(EMPTY_SNAPSHOT, snap({ deadlift: 84 }))).toBe('Deadlift 84 points.');
  });

  test('says only the events that changed since last time', () => {
    const before = snap({ deadlift: 84 });
    const after = snap({ deadlift: 84, pushups: 70 });
    expect(buildAnnouncement(before, after)).toBe('T push-ups 70 points.');
  });

  test('a changed score is said again with its new value', () => {
    expect(buildAnnouncement(snap({ deadlift: 84 }), snap({ deadlift: 90 }))).toBe('Deadlift 90 points.');
  });

  test('nothing changed says nothing', () => {
    expect(buildAnnouncement(snap({ deadlift: 84 }), snap({ deadlift: 84 }))).toBe('');
    expect(buildAnnouncement(EMPTY_SNAPSHOT, snap())).toBe('');
  });

  test('an event entered that scores zero is still said (it is a result)', () => {
    expect(buildAnnouncement(EMPTY_SNAPSHOT, snap({ plank: 0 }))).toBe('Plank 0 points.');
  });

  test('one point is singular', () => {
    expect(buildAnnouncement(EMPTY_SNAPSHOT, snap({ sdc: 1 }))).toBe('Sprint drag carry 1 point.');
  });

  test('the total comes with the fifth event and includes every score', () => {
    const before = snap({ deadlift: 80, pushups: 70, sdc: 60, plank: 90 });
    const after = snap({ deadlift: 80, pushups: 70, sdc: 60, plank: 90, tmr: 50 });
    expect(buildAnnouncement(before, after)).toBe('Two mile run 50 points. Total 350 of 500.');
  });

  test('no total until all five events are in', () => {
    expect(buildAnnouncement(EMPTY_SNAPSHOT, snap({ deadlift: 80, pushups: 70, sdc: 60, plank: 90 }))).not.toMatch(/Total/);
  });

  test('changing one event after all five are in re-says the total', () => {
    const before = snap({ deadlift: 80, pushups: 70, sdc: 60, plank: 90, tmr: 50 });
    const after = snap({ deadlift: 80, pushups: 70, sdc: 60, plank: 90, tmr: 60 });
    expect(buildAnnouncement(before, after)).toBe('Two mile run 60 points. Total 360 of 500.');
  });

  test('clearing one event says so', () => {
    const before = snap({ deadlift: 80, pushups: 70 });
    const after = snap({ deadlift: 80 });
    expect(buildAnnouncement(before, after)).toBe('T push-ups cleared.');
  });

  test('clearing everything says so once', () => {
    const before = snap({ deadlift: 80, pushups: 70 });
    expect(buildAnnouncement(before, snap())).toBe('All events cleared');
  });

  test('every event has a spoken name, and none is an abbreviation', () => {
    expect(Object.keys(SPOKEN_NAMES).sort()).toEqual(EVENTS.map(event => event.key).sort());
    for (const name of Object.values(SPOKEN_NAMES)) expect(name).not.toMatch(/SDC|2MR/);
  });
});
