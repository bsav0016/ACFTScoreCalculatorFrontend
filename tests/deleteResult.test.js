import { deleteSavedResult } from '../components/AcftResults/deleteResult';

const respond = (status) => jest.fn(async () => ({ status, ok: status >= 200 && status < 300 }));

describe('deleteSavedResult', () => {
  test('sends a DELETE for the result and reports success on 204', async () => {
    const request = respond(204);
    expect(await deleteSavedResult(request, 42)).toEqual({ ok: true });
    expect(request).toHaveBeenCalledWith('api/acft_scores/42/', { method: 'DELETE' });
  });

  test('treats 404 as already deleted', async () => {
    expect(await deleteSavedResult(respond(404), 7)).toEqual({ ok: true });
  });

  test('a 401 means signed out and keeps the row', async () => {
    const result = await deleteSavedResult(respond(401), 7);
    expect(result.ok).toBe(false);
    expect(result.signedOut).toBe(true);
    expect(result.message).toMatch(/sign in/i);
  });

  test.each([403, 500, 503])('a %i keeps the row and gives a retry message', async (status) => {
    const result = await deleteSavedResult(respond(status), 7);
    expect(result.ok).toBe(false);
    expect(result.signedOut).toBeUndefined();
    expect(result.message).toMatch(/try again/i);
  });

  test('a network failure keeps the row', async () => {
    const result = await deleteSavedResult(jest.fn(async () => { throw new Error('offline'); }), 7);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/connection/i);
  });
});
