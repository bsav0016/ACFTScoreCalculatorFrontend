// The one-line "what am I running" text on the About screen, so a user can tell you exactly which app version,
// score tables and over-the-air update they have. Pure: About passes in what expo-constants and expo-updates report.

/**
 * @param {object} info
 * @param {string} [info.appVersion]   the app version from app.json
 * @param {string} info.tableVersion   the score table version, for example '250601'
 * @param {string|null} [info.updateId] the id of the over-the-air update that is running, if any
 * @param {boolean} [info.updatesEnabled] false in development builds and in builds without expo-updates
 */
export function describeBuild({ appVersion, tableVersion, updateId, updatesEnabled }) {
  const parts = [];
  if (appVersion) parts.push(`Version ${appVersion}`);
  parts.push(`Tables ${tableVersion}`);
  // Under an embedded launch there is an id too (the build's own bundle); only show an id for a real update.
  parts.push(updatesEnabled && updateId ? `Update ${updateId.slice(0, 8)}` : 'Built-in');
  return parts.join(' · ');
}
