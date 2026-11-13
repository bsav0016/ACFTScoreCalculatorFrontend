import * as Sentry from '@sentry/react-native';
import { debug } from './constants';
import { scrubBreadcrumb, scrubEvent } from './errorScrub';

// The DSN only lets a client send reports to this Sentry project; it cannot read them, so it is safe to ship.
const DSN = 'https://de10c428d4cd3b11b8b6b6dc5ee3aafc@o4512156159442944.ingest.us.sentry.io/4512422431096832';

let started = false;

// Called once, before the app renders. Development builds stay silent so local work does not fill the project with noise.
export function initErrorReporting() {
  if (started) return;
  started = true;
  Sentry.init({
    dsn: DSN,
    enabled: !debug,
    // No usernames, emails or IP addresses, no screenshots, no performance tracing.
    sendDefaultPii: false,
    attachScreenshot: false,
    attachViewHierarchy: false,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}

// Wraps the root component so a crash while rendering is reported and shows Sentry's fallback instead of a blank screen.
export function wrapApp(App) {
  return Sentry.wrap(App);
}

// Report a failure the person was told about (a save, a login, a delete). `area` is a short label such as 'save-score';
// it is the only thing added to the report, so nothing the person typed ever travels with it.
export function reportError(error, area) {
  try {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)), { tags: { area } });
  } catch {
    // Reporting must never break the screen that called it.
  }
}
