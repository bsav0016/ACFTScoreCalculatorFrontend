import { createOnce } from '../components/once';

describe('createOnce', () => {
  test('says yes the first time a key is seen and no after that', () => {
    const once = createOnce();
    expect(once('a')).toBe(true);
    expect(once('a')).toBe(false);
    expect(once('b')).toBe(true);
    expect(once('a')).toBe(false);
  });

  test('each instance keeps its own memory', () => {
    const first = createOnce();
    const second = createOnce();
    first('x');
    expect(second('x')).toBe(true);
  });
});
