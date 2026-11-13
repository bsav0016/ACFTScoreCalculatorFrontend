import { scrubText, scrubUrl, scrubBreadcrumb, scrubEvent } from '../components/errorScrub';

describe('scrubText', () => {
  test('hides email addresses', () => {
    expect(scrubText('No account for jane.doe+aft@example.co.uk, try again')).toBe('No account for [email], try again');
    expect(scrubText('a@b.com and c@d.org')).toBe('[email] and [email]');
  });
  test('hides sign-in tokens', () => {
    expect(scrubText('Authorization: Token 9c8b7a6f5e4d3c2b1a0f')).toBe('Authorization: Token [token]');
    expect(scrubText('bearer abcdefgh12345678')).toBe('bearer [token]');
  });
  test('leaves ordinary text and non-strings alone', () => {
    expect(scrubText('Network request failed')).toBe('Network request failed');
    expect(scrubText(undefined)).toBeUndefined();
    expect(scrubText(42)).toBe(42);
  });
});

describe('scrubUrl', () => {
  test('drops the query string and fragment', () => {
    expect(scrubUrl('https://api.example.com/api/acft_scores/percentiles/?age=28&total=400#x'))
      .toBe('https://api.example.com/api/acft_scores/percentiles/');
  });
  test('replaces numeric ids', () => {
    expect(scrubUrl('https://api.example.com/api/users/6981/')).toBe('https://api.example.com/api/users/:id/');
    expect(scrubUrl('https://api.example.com/api/acft_scores/12/save_results/'))
      .toBe('https://api.example.com/api/acft_scores/:id/save_results/');
    expect(scrubUrl('/api/users/6981')).toBe('/api/users/:id');
  });
  test('keeps non-numeric segments and ignores non-strings', () => {
    expect(scrubUrl('https://api.example.com/api/users/demographics/')).toBe('https://api.example.com/api/users/demographics/');
    expect(scrubUrl(undefined)).toBeUndefined();
  });
});

describe('scrubBreadcrumb', () => {
  test('cleans the url and message and drops bodies', () => {
    const out = scrubBreadcrumb({
      category: 'fetch', message: 'GET for a@b.com',
      data: { url: 'https://x.test/api/users/55/?a=1', method: 'GET', status_code: 200, body: 'secret', request_body_size: 10 },
    });
    expect(out.message).toBe('GET for [email]');
    expect(out.data).toEqual({ url: 'https://x.test/api/users/:id/', method: 'GET', status_code: 200 });
  });
  test('handles a missing breadcrumb or missing data', () => {
    expect(scrubBreadcrumb(null)).toBeNull();
    expect(scrubBreadcrumb({ category: 'ui.click' })).toEqual({ category: 'ui.click' });
  });
  test('console breadcrumbs keep a short scrubbed message and lose the logged arguments', () => {
    const out = scrubBreadcrumb({
      category: 'console', level: 'log', message: 'Error response: ' + 'x'.repeat(300) + ' a@b.com',
      data: { logger: 'console', arguments: [{ email: ['user with this Email already exists.'], username: 'alice' }] },
    });
    expect(out.message.length).toBeLessThanOrEqual(200);
    expect(out.data).toEqual({ logger: 'console' });
  });

  test('cleans navigation breadcrumbs', () => {
    expect(scrubBreadcrumb({ category: 'navigation', data: { from: '/users/9', to: '/results?x=1' } }).data)
      .toEqual({ from: '/users/:id', to: '/results' });
  });
});

describe('scrubEvent', () => {
  const event = () => ({
    event_id: 'abc',
    level: 'error',
    user: { id: '5', email: 'a@b.com', ip_address: '1.2.3.4', username: 'alice_runs' },
    server_name: 'Brian\'s iPhone',
    request: { url: 'https://x.test/api/users/5/?token=1', method: 'POST', headers: { Authorization: 'Token abc' }, data: '{"password":"x"}', cookies: 'c' },
    extra: { form: { password: 'hunter2' } },
    tags: { area: 'save-score' },
    exception: { values: [{ type: 'Error', value: 'Could not save for alice@example.com' }] },
    breadcrumbs: [{ category: 'fetch', data: { url: 'https://x.test/api/users/5/?z=1' } }],
  });

  test('removes the user, device name, request details and extras', () => {
    const out = scrubEvent(event());
    expect(out.user).toBeUndefined();
    expect(out.server_name).toBeUndefined();
    expect(out.extra).toBeUndefined();
    expect(out.request).toEqual({ url: 'https://x.test/api/users/:id/', method: 'POST' });
    expect(JSON.stringify(out)).not.toMatch(/hunter2|password|Token abc|1\.2\.3\.4|alice/);
  });

  test('keeps what is useful: the error, its area tag and level', () => {
    const out = scrubEvent(event());
    expect(out.tags).toEqual({ area: 'save-score' });
    expect(out.level).toBe('error');
    expect(out.exception.values[0]).toEqual({ type: 'Error', value: 'Could not save for [email]' });
    expect(out.breadcrumbs[0].data.url).toBe('https://x.test/api/users/:id/');
  });

  test('handles the object form of breadcrumbs and events without them', () => {
    const out = scrubEvent({ breadcrumbs: { values: [{ data: { url: '/api/users/3/?a=b' } }] } });
    expect(out.breadcrumbs.values[0].data.url).toBe('/api/users/:id/');
    expect(scrubEvent({ message: 'x@y.com failed' }).message).toBe('[email] failed');
    expect(scrubEvent(null)).toBeNull();
  });

  test('does not mutate its input', () => {
    const input = event();
    scrubEvent(input);
    expect(input.user.email).toBe('a@b.com');
    expect(input.extra.form.password).toBe('hunter2');
  });
});
