// Removes personal data from an error report before it leaves the phone. Pure and free of React Native imports so it
// can be unit tested (tests/errorScrub.test.js). errorReporting.js plugs these into Sentry's beforeSend and
// beforeBreadcrumb hooks.

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const TOKEN = /\b(Token|Bearer)\s+[A-Za-z0-9._~+/=-]{8,}/gi;

// Free text (error messages, breadcrumb messages): hide email addresses and sign-in tokens.
export function scrubText(text) {
  if (typeof text !== 'string') return text;
  return text.replace(TOKEN, '$1 [token]').replace(EMAIL, '[email]');
}

// A URL without its query string or fragment, and with numeric path segments (user and score ids) replaced.
export function scrubUrl(url) {
  if (typeof url !== 'string') return url;
  const base = url.split(/[?#]/)[0];
  return base.replace(/\/\d+(?=\/|$)/g, '/:id');
}

export function scrubBreadcrumb(breadcrumb) {
  if (!breadcrumb) return breadcrumb;
  const next = { ...breadcrumb };
  if (typeof next.message === 'string') next.message = scrubText(next.message);
  if (next.data) {
    const data = { ...next.data };
    if (typeof data.url === 'string') data.url = scrubUrl(data.url);
    if (typeof data.to === 'string') data.to = scrubUrl(data.to);
    if (typeof data.from === 'string') data.from = scrubUrl(data.from);
    // Never keep what was sent or received.
    delete data.request_body_size;
    delete data.response_body_size;
    delete data.body;
    next.data = data;
  }
  return next;
}

// The whole event. Returns the event with user, request bodies, headers, cookies and addresses removed.
export function scrubEvent(event) {
  if (!event) return event;
  const next = { ...event };
  delete next.user;
  delete next.server_name;
  if (next.request) {
    next.request = { url: scrubUrl(next.request.url), method: next.request.method };
  }
  if (typeof next.message === 'string') next.message = scrubText(next.message);
  if (next.exception && Array.isArray(next.exception.values)) {
    next.exception = {
      ...next.exception,
      values: next.exception.values.map((value) => ({ ...value, value: scrubText(value.value) })),
    };
  }
  if (Array.isArray(next.breadcrumbs)) next.breadcrumbs = next.breadcrumbs.map(scrubBreadcrumb);
  if (next.breadcrumbs && Array.isArray(next.breadcrumbs.values)) {
    next.breadcrumbs = { ...next.breadcrumbs, values: next.breadcrumbs.values.map(scrubBreadcrumb) };
  }
  // Only what the app sets on purpose is kept: tags, not free-form extras or contexts that might hold form input.
  delete next.extra;
  return next;
}
