/**
 * Everything about being signed in, with its dependencies passed in so it can be tested without a phone.
 * components/session.js wires the real ones. Nothing here imports React Native.
 *
 * - The sign-in token and user id live in the platform's secure storage (Keychain / Keystore). Older builds kept
 *   them in AsyncStorage; the first read after an update moves them across, so nobody is signed out by it.
 * - If secure storage ever fails on a device, the app falls back to AsyncStorage rather than locking the person out.
 * - authFetch adds the token to a request and, when the server answers 401 (the token was ended, expired after 90
 *   days idle, or the password was changed elsewhere), forgets it so the next screen asks the person to sign in.
 */

export const TOKEN_KEY = 'MR_token';
export const ID_KEY = 'user_id';

export function createSession({ secureStore, asyncStorage, getBackendUrl, fetchFn, log = () => {} }) {
  const url = (path) => (/^https?:\/\//.test(path) ? path : `${getBackendUrl().replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`);

  async function readLegacy() {
    try {
      const token = await asyncStorage.getItem(TOKEN_KEY);
      const id = await asyncStorage.getItem(ID_KEY);
      return token && id ? { token, id } : null;
    } catch (error) {
      log('Could not read the old stored login', error);
      return null;
    }
  }

  async function removeLegacy() {
    try {
      await asyncStorage.removeItem(TOKEN_KEY);
      await asyncStorage.removeItem(ID_KEY);
    } catch (error) {
      log('Could not clear the old stored login', error);
    }
  }

  async function writeSecure({ token, id }) {
    await secureStore.setItemAsync(TOKEN_KEY, token);
    await secureStore.setItemAsync(ID_KEY, String(id));
  }

  // The stored login, or null when signed out.
  async function getSession() {
    let secure = null;
    try {
      const token = await secureStore.getItemAsync(TOKEN_KEY);
      const id = await secureStore.getItemAsync(ID_KEY);
      secure = token && id ? { token, id } : null;
    } catch (error) {
      log('Secure storage could not be read', error);
      return readLegacy();
    }
    if (secure) return secure;

    // Signed in by an older build: move the login into secure storage, then drop the old copy.
    const legacy = await readLegacy();
    if (!legacy) return null;
    try {
      await writeSecure(legacy);
      await removeLegacy();
    } catch (error) {
      log('Could not move the login into secure storage; keeping the old copy', error);
    }
    return legacy;
  }

  async function setSession(token, id) {
    const session = { token, id: String(id) };
    try {
      await writeSecure(session);
      await removeLegacy();
    } catch (error) {
      log('Secure storage could not be written; falling back to AsyncStorage', error);
      await asyncStorage.setItem(TOKEN_KEY, session.token);
      await asyncStorage.setItem(ID_KEY, session.id);
    }
  }

  async function clearSession() {
    try {
      await secureStore.deleteItemAsync(TOKEN_KEY);
      await secureStore.deleteItemAsync(ID_KEY);
    } catch (error) {
      log('Secure storage could not be cleared', error);
    }
    await removeLegacy();
  }

  async function hasSession() {
    return (await getSession()) !== null;
  }

  // fetch with the stored token attached. A 401 clears the stored login; the response is returned either way.
  async function authFetch(path, options = {}) {
    const session = await getSession();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (session) headers.Authorization = `Token ${session.token}`;
    const response = await fetchFn(url(path), { ...options, headers });
    if (response.status === 401) {
      await clearSession();
    }
    return response;
  }

  // Signs out on this phone straight away, then tells the server so the token cannot be used from anywhere else.
  // The server call is best effort and is not waited for beyond starting it.
  async function signOut() {
    const current = await getSession();
    await clearSession();
    if (current) {
      Promise.resolve()
        .then(() => fetchFn(url('api/users/logout/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Token ${current.token}` },
        }))
        .catch((error) => log('Could not tell the server about the sign-out', error));
    }
  }

  async function postJson(path, body) {
    try {
      const response = await fetchFn(url(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      let data = null;
      try {
        data = await response.json();
      } catch {
        // Not JSON (for example an error page); the status alone decides below.
      }
      return { status: response.status, data };
    } catch (error) {
      log('Request failed', error);
      return { status: 0, data: null };
    }
  }

  const passwordMessages = (data) => (data && Array.isArray(data.password) ? data.password : null);

  // Ask for a six-digit code by email. The server answers the same whether or not the address has an account.
  async function requestPasswordReset(email) {
    const { status } = await postJson('api/users/password_reset/request/', { email: email.trim() });
    if (status === 200) return { ok: true };
    if (status === 429) return { ok: false, kind: 'throttled' };
    if (status === 0) return { ok: false, kind: 'network' };
    return { ok: false, kind: 'unknown' };
  }

  async function confirmPasswordReset({ email, code, newPassword }) {
    const { status, data } = await postJson('api/users/password_reset/confirm/', {
      email: email.trim(), code: code.trim(), new_password: newPassword,
    });
    if (status === 200) {
      await clearSession();
      return { ok: true };
    }
    if (status === 429) return { ok: false, kind: 'throttled' };
    if (status === 0) return { ok: false, kind: 'network' };
    const messages = passwordMessages(data);
    if (status === 400 && messages) return { ok: false, kind: 'weak', messages };
    if (status === 400) return { ok: false, kind: 'invalid_code' };
    return { ok: false, kind: 'unknown' };
  }

  // Change the password of the signed-in account. On success the server replaces the token, and the new one is kept.
  async function changePassword(currentPassword, newPassword) {
    const session = await getSession();
    if (!session) return { ok: false, kind: 'signed_out' };
    let response;
    let data = null;
    try {
      response = await authFetch('api/users/change_password/', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      try {
        data = await response.json();
      } catch {
        // Not JSON; the status decides.
      }
    } catch (error) {
      log('Request failed', error);
      return { ok: false, kind: 'network' };
    }
    if (response.status === 200 && data && data.token) {
      await setSession(data.token, session.id);
      return { ok: true };
    }
    if (response.status === 401) return { ok: false, kind: 'signed_out' };
    if (response.status === 403) return { ok: false, kind: 'wrong_password' };
    if (response.status === 429) return { ok: false, kind: 'throttled' };
    const messages = passwordMessages(data);
    if (response.status === 400 && messages) return { ok: false, kind: 'weak', messages };
    return { ok: false, kind: 'unknown' };
  }

  return {
    getSession, setSession, clearSession, hasSession, authFetch, signOut,
    requestPasswordReset, confirmPasswordReset, changePassword,
  };
}
