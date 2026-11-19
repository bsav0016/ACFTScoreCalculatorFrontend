// Opens a web or mail link, and says so on screen when the phone cannot (no browser or mail app set up, a restricted
// phone). Linking.openURL rejects in that case; left uncaught it surfaced as an error report each time. Kept free of React
// Native imports so it can be unit tested: callers pass in Linking and notify.
export async function openLink(url, { linking, notify, what = 'the link' }) {
  try {
    await linking.openURL(url);
    return true;
  } catch {
    notify(`Couldn't open ${what} on this phone. You can find it at ${url.replace(/^mailto:/, '')}`, 'info');
    return false;
  }
}
