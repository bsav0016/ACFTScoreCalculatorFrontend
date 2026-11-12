import { parseTarget, fetchTarget, saveTarget, targetStatus } from '../components/AcftResults/target';

const respond = (status, body) => jest.fn(async () => ({ status, ok: status >= 200 && status < 300, json: async () => body }));
const offline = () => jest.fn(async () => { throw new Error('offline'); });

describe('parseTarget', () => {
  test.each([[0, 0], [450, 450], [500, 500], ['450', 450], [' 300 ', 300], ['0', 0]])('%p -> %p', (input, expected) => {
    expect(parseTarget(input)).toBe(expected);
  });
  test.each([[-1], [501], [450.5], ['501'], ['4.5'], ['-5'], ['abc'], [''], ['  '], [null], [undefined], [true], [[450]], ['1000']])(
    '%p is not a target', (input) => {
      expect(parseTarget(input)).toBeNull();
    });
});

describe('fetchTarget', () => {
  test('reads target_total from the demographics endpoint', async () => {
    const request = respond(200, { gender: 'M', combat_mos: true, target_total: 425 });
    expect(await fetchTarget(request)).toBe(425);
    expect(request).toHaveBeenCalledWith('api/users/demographics/');
  });
  test('null when unset, invalid, signed out, failing or offline', async () => {
    expect(await fetchTarget(respond(200, { target_total: null }))).toBeNull();
    expect(await fetchTarget(respond(200, {}))).toBeNull();
    expect(await fetchTarget(respond(200, { target_total: 900 }))).toBeNull();
    expect(await fetchTarget(respond(401, {}))).toBeNull();
    expect(await fetchTarget(respond(500, {}))).toBeNull();
    expect(await fetchTarget(offline())).toBeNull();
  });
});

describe('saveTarget', () => {
  test('PATCHes only target_total', async () => {
    const request = respond(200, {});
    expect(await saveTarget(request, 450)).toBe(true);
    expect(request).toHaveBeenCalledWith('api/users/demographics/', {
      method: 'PATCH', body: JSON.stringify({ target_total: 450 }),
    });
  });
  test('null clears it', async () => {
    const request = respond(200, {});
    expect(await saveTarget(request, null)).toBe(true);
    expect(request.mock.calls[0][1].body).toBe('{"target_total":null}');
  });
  test('refuses invalid values without calling the server', async () => {
    const request = respond(200, {});
    expect(await saveTarget(request, 501)).toBe(false);
    expect(await saveTarget(request, 'x')).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });
  test('false when the server rejects or is unreachable', async () => {
    expect(await saveTarget(respond(400, {}), 450)).toBe(false);
    expect(await saveTarget(respond(401, {}), 450)).toBe(false);
    expect(await saveTarget(offline(), 450)).toBe(false);
  });
});

describe('targetStatus', () => {
  test('distance to go and reached', () => {
    expect(targetStatus(450, 410)).toEqual({ reached: false, remaining: 40 });
    expect(targetStatus(450, 450)).toEqual({ reached: true, remaining: 0 });
    expect(targetStatus(450, 480)).toEqual({ reached: true, remaining: 0 });
  });
  test('null without a target or a total', () => {
    expect(targetStatus(null, 400)).toBeNull();
    expect(targetStatus(450, null)).toBeNull();
    expect(targetStatus(undefined, undefined)).toBeNull();
  });
});
