import { createSession, TOKEN_KEY, ID_KEY } from '../components/sessionCore';

// In-memory stand-ins for the two stores. `failing` makes every call on a store throw, to test the fallbacks.
function memoryStore({ asyncApi = false } = {}) {
  const data = new Map();
  const store = {
    data,
    failing: false,
    check() { if (store.failing) throw new Error('store unavailable'); },
  };
  const read = async (key) => { store.check(); return data.has(key) ? data.get(key) : null; };
  const write = async (key, value) => { store.check(); data.set(key, value); };
  const remove = async (key) => { store.check(); data.delete(key); };
  if (asyncApi) {
    Object.assign(store, { getItem: read, setItem: write, removeItem: remove });
  } else {
    Object.assign(store, { getItemAsync: read, setItemAsync: write, deleteItemAsync: remove });
  }
  return store;
}

function jsonResponse(status, body) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

function setup(respond = () => jsonResponse(200, {})) {
  const secure = memoryStore();
  const legacy = memoryStore({ asyncApi: true });
  const calls = [];
  const fetchFn = jest.fn(async (url, options) => {
    calls.push({ url, options });
    return respond(url, options);
  });
  const session = createSession({
    secureStore: secure, asyncStorage: legacy, getBackendUrl: () => 'https://api.test/', fetchFn,
  });
  return { secure, legacy, calls, fetchFn, session };
}

describe('stored login', () => {
  test('is empty when nobody has signed in', async () => {
    const { session } = setup();
    expect(await session.getSession()).toBeNull();
    expect(await session.hasSession()).toBe(false);
  });

  test('is kept in secure storage and read back', async () => {
    const { session, secure, legacy } = setup();
    await session.setSession('tok123', 42);
    expect(await session.getSession()).toEqual({ token: 'tok123', id: '42' });
    expect(secure.data.get(TOKEN_KEY)).toBe('tok123');
    expect(legacy.data.size).toBe(0);
  });

  test('clearing removes it from both stores', async () => {
    const { session, secure, legacy } = setup();
    await session.setSession('tok123', 42);
    legacy.data.set(TOKEN_KEY, 'old');
    legacy.data.set(ID_KEY, '1');
    await session.clearSession();
    expect(secure.data.size).toBe(0);
    expect(legacy.data.size).toBe(0);
    expect(await session.hasSession()).toBe(false);
  });
});

describe('moving an older login into secure storage', () => {
  test('a login saved by an older build is found, moved and the old copy removed', async () => {
    const { session, secure, legacy } = setup();
    legacy.data.set(TOKEN_KEY, 'oldtoken');
    legacy.data.set(ID_KEY, '7');
    expect(await session.getSession()).toEqual({ token: 'oldtoken', id: '7' });
    expect(secure.data.get(TOKEN_KEY)).toBe('oldtoken');
    expect(secure.data.get(ID_KEY)).toBe('7');
    expect(legacy.data.size).toBe(0);
    expect(await session.getSession()).toEqual({ token: 'oldtoken', id: '7' }); // still signed in afterwards
  });

  test('an incomplete older login (token without id) is ignored', async () => {
    const { session, legacy } = setup();
    legacy.data.set(TOKEN_KEY, 'oldtoken');
    expect(await session.getSession()).toBeNull();
  });

  test('if secure storage cannot be written, the person stays signed in and the old copy is kept', async () => {
    const { session, secure, legacy } = setup();
    legacy.data.set(TOKEN_KEY, 'oldtoken');
    legacy.data.set(ID_KEY, '7');
    secure.setItemAsync = async () => { throw new Error('keychain locked'); };
    expect(await session.getSession()).toEqual({ token: 'oldtoken', id: '7' });
    expect(legacy.data.get(TOKEN_KEY)).toBe('oldtoken');
  });

  test('secure storage winning over a stale older copy', async () => {
    const { session, secure, legacy } = setup();
    secure.data.set(TOKEN_KEY, 'newtoken');
    secure.data.set(ID_KEY, '9');
    legacy.data.set(TOKEN_KEY, 'oldtoken');
    legacy.data.set(ID_KEY, '7');
    expect(await session.getSession()).toEqual({ token: 'newtoken', id: '9' });
  });
});

describe('when secure storage fails', () => {
  test('reading falls back to the older store', async () => {
    const { session, secure, legacy } = setup();
    legacy.data.set(TOKEN_KEY, 'oldtoken');
    legacy.data.set(ID_KEY, '7');
    secure.failing = true;
    expect(await session.getSession()).toEqual({ token: 'oldtoken', id: '7' });
  });

  test('writing falls back to the older store so sign-in still works', async () => {
    const { session, secure, legacy } = setup();
    secure.failing = true;
    await session.setSession('tok', 5);
    expect(legacy.data.get(TOKEN_KEY)).toBe('tok');
    expect(legacy.data.get(ID_KEY)).toBe('5');
    expect(await session.getSession()).toEqual({ token: 'tok', id: '5' });
  });

  test('clearing does not throw', async () => {
    const { session, secure } = setup();
    secure.failing = true;
    await expect(session.clearSession()).resolves.toBeUndefined();
  });
});

describe('authFetch', () => {
  test('adds the token and joins the path to the backend address', async () => {
    const { session, calls } = setup();
    await session.setSession('tok123', 1);
    await session.authFetch('api/users/1/');
    expect(calls[0].url).toBe('https://api.test/api/users/1/');
    expect(calls[0].options.headers.Authorization).toBe('Token tok123');
    expect(calls[0].options.headers['Content-Type']).toBe('application/json');
  });

  test('tolerates a leading slash and passes the method and body through', async () => {
    const { session, calls } = setup();
    await session.setSession('tok123', 1);
    await session.authFetch('/api/acft_scores/1/save_results/', { method: 'POST', body: '{}' });
    expect(calls[0].url).toBe('https://api.test/api/acft_scores/1/save_results/');
    expect(calls[0].options.method).toBe('POST');
    expect(calls[0].options.body).toBe('{}');
  });

  test('sends no Authorization header when signed out', async () => {
    const { session, calls } = setup();
    await session.authFetch('api/users/1/');
    expect(calls[0].options.headers.Authorization).toBeUndefined();
  });

  test('a 401 forgets the login and still returns the response', async () => {
    const { session } = setup(() => jsonResponse(401, { detail: 'Invalid token.' }));
    await session.setSession('tok123', 1);
    const res = await session.authFetch('api/users/1/');
    expect(res.status).toBe(401);
    expect(await session.hasSession()).toBe(false);
  });

  test('other errors leave the login alone', async () => {
    for (const status of [400, 403, 404, 500]) {
      const { session } = setup(() => jsonResponse(status, {}));
      await session.setSession('tok123', 1);
      await session.authFetch('api/users/1/');
      expect(await session.hasSession()).toBe(true);
    }
  });
});

describe('signOut', () => {
  test('signs out on the phone and tells the server with the old token', async () => {
    const { session, calls } = setup();
    await session.setSession('tok123', 1);
    await session.signOut();
    expect(await session.hasSession()).toBe(false);
    await new Promise((resolve) => setImmediate(resolve));
    const logout = calls.find((call) => call.url === 'https://api.test/api/users/logout/');
    expect(logout.options.method).toBe('POST');
    expect(logout.options.headers.Authorization).toBe('Token tok123');
  });

  test('still signs out when the server cannot be reached', async () => {
    const { session, fetchFn } = setup();
    fetchFn.mockRejectedValue(new Error('offline'));
    await session.setSession('tok123', 1);
    await expect(session.signOut()).resolves.toBeUndefined();
    expect(await session.hasSession()).toBe(false);
  });

  test('signing out when already signed out does nothing', async () => {
    const { session, calls } = setup();
    await session.signOut();
    expect(calls).toHaveLength(0);
  });
});

describe('requestPasswordReset', () => {
  test('posts the trimmed email without a token', async () => {
    const { session, calls } = setup();
    await session.setSession('tok', 1);
    const result = await session.requestPasswordReset('  a@b.com ');
    expect(result).toEqual({ ok: true });
    expect(calls[0].url).toBe('https://api.test/api/users/password_reset/request/');
    expect(JSON.parse(calls[0].options.body)).toEqual({ email: 'a@b.com' });
    expect(calls[0].options.headers.Authorization).toBeUndefined();
  });

  test('maps throttling, network and other failures', async () => {
    expect((await setup(() => jsonResponse(429, {})).session.requestPasswordReset('a@b.com')).kind).toBe('throttled');
    expect((await setup(() => jsonResponse(500, {})).session.requestPasswordReset('a@b.com')).kind).toBe('unknown');
    const offline = setup();
    offline.fetchFn.mockRejectedValue(new Error('offline'));
    expect((await offline.session.requestPasswordReset('a@b.com')).kind).toBe('network');
  });
});

describe('confirmPasswordReset', () => {
  const args = { email: ' a@b.com ', code: ' 123456 ', newPassword: 'harbor-light-77' };

  test('posts the trimmed email and code and reports success', async () => {
    const { session, calls } = setup();
    const result = await session.confirmPasswordReset(args);
    expect(result).toEqual({ ok: true });
    expect(JSON.parse(calls[0].options.body)).toEqual({
      email: 'a@b.com', code: '123456', new_password: 'harbor-light-77' });
  });

  test('a successful reset forgets any stored login (the server ended it)', async () => {
    const { session } = setup();
    await session.setSession('tok', 1);
    await session.confirmPasswordReset(args);
    expect(await session.hasSession()).toBe(false);
  });

  test('a wrong or expired code is reported as such', async () => {
    const { session } = setup(() => jsonResponse(400, { message: 'That code is not valid or has expired.' }));
    expect(await session.confirmPasswordReset(args)).toEqual({ ok: false, kind: 'invalid_code' });
  });

  test('a rejected password carries the server messages and keeps the stored login', async () => {
    const { session } = setup(() => jsonResponse(400, { password: ['This password is too common.'] }));
    await session.setSession('tok', 1);
    expect(await session.confirmPasswordReset(args)).toEqual({
      ok: false, kind: 'weak', messages: ['This password is too common.'] });
    expect(await session.hasSession()).toBe(true);
  });

  test('maps throttling and network failures', async () => {
    expect((await setup(() => jsonResponse(429, {})).session.confirmPasswordReset(args)).kind).toBe('throttled');
    const offline = setup();
    offline.fetchFn.mockRejectedValue(new Error('offline'));
    expect((await offline.session.confirmPasswordReset(args)).kind).toBe('network');
  });
});

describe('changePassword', () => {
  test('keeps the replacement token the server returns', async () => {
    const { session, calls } = setup(() => jsonResponse(200, { token: 'newtoken' }));
    await session.setSession('oldtoken', 3);
    expect(await session.changePassword('old-password', 'harbor-light-77')).toEqual({ ok: true });
    expect(calls[0].options.headers.Authorization).toBe('Token oldtoken');
    expect(JSON.parse(calls[0].options.body)).toEqual({
      current_password: 'old-password', new_password: 'harbor-light-77' });
    expect(await session.getSession()).toEqual({ token: 'newtoken', id: '3' });
  });

  test('a wrong current password changes nothing', async () => {
    const { session } = setup(() => jsonResponse(403, { message: 'Incorrect password' }));
    await session.setSession('oldtoken', 3);
    expect(await session.changePassword('nope', 'harbor-light-77')).toEqual({ ok: false, kind: 'wrong_password' });
    expect((await session.getSession()).token).toBe('oldtoken');
  });

  test('a rejected new password carries the server messages', async () => {
    const { session } = setup(() => jsonResponse(400, { password: ['This password is too short.'] }));
    await session.setSession('oldtoken', 3);
    expect(await session.changePassword('old-password', 'x')).toEqual({
      ok: false, kind: 'weak', messages: ['This password is too short.'] });
  });

  test('an ended login is reported as signed out and forgotten', async () => {
    const { session } = setup(() => jsonResponse(401, { detail: 'Invalid token.' }));
    await session.setSession('oldtoken', 3);
    expect(await session.changePassword('old-password', 'harbor-light-77')).toEqual({ ok: false, kind: 'signed_out' });
    expect(await session.hasSession()).toBe(false);
  });

  test('without a login it does not call the server', async () => {
    const { session, calls } = setup();
    expect(await session.changePassword('a', 'b')).toEqual({ ok: false, kind: 'signed_out' });
    expect(calls).toHaveLength(0);
  });

  test('maps throttling and network failures', async () => {
    const throttled = setup(() => jsonResponse(429, {}));
    await throttled.session.setSession('t', 1);
    expect((await throttled.session.changePassword('a', 'b')).kind).toBe('throttled');
    const offline = setup();
    await offline.session.setSession('t', 1);
    offline.fetchFn.mockRejectedValue(new Error('offline'));
    expect((await offline.session.changePassword('a', 'b')).kind).toBe('network');
  });
});
