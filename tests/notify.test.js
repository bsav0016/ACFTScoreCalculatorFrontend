import { notify, onNotify } from '../components/notify';

describe('notify', () => {
  test('delivers the message and type to the listener, defaulting to an error', () => {
    const seen = [];
    const off = onNotify((m) => seen.push(m));
    notify('Something failed');
    notify('All saved', 'success');
    expect(seen).toEqual([
      { message: 'Something failed', type: 'error' },
      { message: 'All saved', type: 'success' },
    ]);
    off();
  });

  test('does nothing when nobody is listening, and never throws', () => {
    expect(() => notify('into the void')).not.toThrow();
  });

  test('ignores empty and non-string messages', () => {
    const seen = [];
    const off = onNotify((m) => seen.push(m));
    notify('');
    notify(undefined);
    notify(new Error('x'));
    expect(seen).toEqual([]);
    off();
  });

  test('stops delivering after the listener is removed', () => {
    const seen = [];
    const off = onNotify((m) => seen.push(m));
    off();
    notify('late');
    expect(seen).toEqual([]);
  });

  test('a newer listener replaces the older one, and the old remover does not unseat it', () => {
    const first = [];
    const second = [];
    const offFirst = onNotify((m) => first.push(m));
    const offSecond = onNotify((m) => second.push(m));
    offFirst();
    notify('hello');
    expect(first).toEqual([]);
    expect(second).toHaveLength(1);
    offSecond();
  });
});
