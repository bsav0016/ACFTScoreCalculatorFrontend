# Releasing

Two kinds of release:

| Kind | What changes | How it ships | Reaches users |
| --- | --- | --- | --- |
| **Over-the-air update** | JavaScript and data only (scoring tables, screens, text) | `npm run update:production` | Minutes after publishing, on the next launch of an installed build that has `expo-updates` |
| **Store release** | Anything native: a new Expo SDK, a native module, permissions, `app.json` native settings, a new app version | `eas build` then `eas submit`, then App Store / Play review | Days, as people update |

**Rule of thumb:** if the change could not run in the app that is already installed, it is a store release. When unsure, it is a store release.

An update is only delivered to builds with the **same app version** (`runtimeVersion` follows `version` in `app.json`). A store release with new native code therefore gets a new version number, and updates are published for that version only.

## One-time setup

1. `npx eas-cli login` (your Expo account).
2. The first build that can receive updates is a normal store build with `expo-updates` in it (version 3.3.0 or later). Builds from before it never update this way.

## Releasing 3.3.0 (the first build that can receive updates)

3.3.0 is a store release: it adds `expo-updates` and `expo-secure-store` (the sign-in token moves to the phone's secure storage) and the account screens (forgot password, change password). Builds before it never receive updates. Do these in order and stop at the first surprise.

1. **Backend first.** Nothing to do: the account endpoints, the reset emails and the token expiry are already live, and the shipped builds keep working against them.
2. **Build and test before anyone sees it.**
   ```
   npx eas-cli login
   npx eas-cli build --platform ios --profile production
   npx eas-cli build --platform android --profile production
   ```
   If the build asks about the version, check that it is 3.3.0 with iOS build 41 and Android versionCode 16 (`app.json`); a store will refuse a build number it has already seen.
3. **iOS: TestFlight.** `npx eas-cli submit --platform ios --profile production` sends the build to App Store Connect. Install it from TestFlight **on a phone that already has the current App Store version and is signed in**, then run the checks below. Only then submit it for App Review.
4. **Android: internal testing.** Upload the build to a Play Console internal testing track (or `eas submit --platform android` if a Google service-account key is set up) and install it over the current Play version. Promote to production after the checks below.
5. **Checks on each phone** (these are what the automated tests cannot cover):
   - Installed over the old version, you are **still signed in** (the login moved to secure storage).
   - Sign out, then sign in again.
   - Login screen, "Forgot your password?": request a code, read the email (check spam), enter the code and a new password, sign in with it.
   - Profile, "Change password": change it, sign out, sign in with the new one.
   - Calculate and save a score; open Saved Results.
   - Start the app with the phone in airplane mode: it opens, calculators work, saving says it could not reach the server.
   - About screen shows the 3.3.0 build details.
6. **After release**, publish the current code to the preview channel first to confirm the update path works end to end (`npm run update:preview`), then follow "Publishing" below for real fixes.

## Publishing a JavaScript or table fix

1. Make the change on a branch and open a PR as usual (CI runs the scoring tests, lint and a bundle check).
2. **Try it on preview first.** From your branch:
   ```
   npm run update:preview
   ```
   This refuses to run with uncommitted changes, runs `npm test`, `npm run lint` and `npm run build:check`, then publishes to the `preview` channel. Open a preview build (an internal or TestFlight build made with `eas build --profile preview`), force-quit and reopen the app twice (the update downloads on the first launch and applies on the second), and check the fix. The About screen will show the update id once stage 3 of the update work is in.
3. Merge the PR.
4. Publish to everyone, from an up-to-date `main`:
   ```
   git checkout main && git pull
   npm run update:production
   ```
   It refuses unless you are on `main`, the tree is clean and `HEAD` equals `origin/main`, so production gets exactly what was merged.
5. Add `-- --dry-run` to either command to run every check and print the publish command without publishing:
   ```
   npm run update:production -- --dry-run
   ```

## If an update is bad: roll back

Updates are applied on the next launch, so act quickly, but nothing is forced mid-session.

1. Find the update group id: `npx eas-cli update:list --branch production --limit 5`.
2. Roll back to the group published before it (or, if there was none, to the build's embedded code):
   ```
   npx eas-cli update:rollback <GROUP_ID> --message "Roll back: <why>"
   ```
   The group must be the latest for its branch and runtime version.
3. Phones pick up the rollback the same way they picked up the update: on their next launch, then applied on the one after.
4. Fix forward on a branch, test it on preview, then publish again.

To put a specific earlier update back, use `npx eas-cli update:republish --channel production --group <GROUP_ID>`.

A rollback cannot recall the update from phones that already applied it and never reopen the app; it only affects the next check.

## When the Army publishes a new scale

1. Add the new chart as a fixture next to `tests/fixtures/aft-score-tables-250601.txt`, regenerate the tables with the builders in `pythonBuilderFiles/`, update `data/aft_tables_*.json`, and point `tests/aftOfficialTables.test.js` at the new fixture.
2. The backend keeps a copy of the shared table and pins its hash (backend `#19`); update it in the same change.
3. Update the "Current as of" date on the home screen and in `app.json` (stage 3 of the update work makes this come from the table data).
4. Ship the frontend as an update (above), and deploy the backend change.

## Rules

- Never publish an update that needs native code the installed build lacks. Dependabot bumps of native packages (for example the React Native CLI or FontAwesome native bindings) go out as a store release with a new version.
- CI has no Expo credentials on purpose, so publishing is always done by you with `npm run update:*`.
- Check Apple's and Google's current rules on over-the-air updates before relying on this for anything beyond fixing JavaScript and data.
