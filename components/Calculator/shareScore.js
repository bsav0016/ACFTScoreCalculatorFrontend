// The text a soldier sends when they share a finished score. Plain text through the phone's share sheet, so it works
// in any messaging app and needs no native module (an over-the-air update can carry it). No age, name or account detail
// goes into the message: only the five event scores, the total and a link.
import { appStoreLink, playStoreLink } from '../growthLinks';

const LABELS = [
  ['deadlift', 'Deadlift'],
  ['pushups', 'T-Push Ups'],
  ['sdc', 'SDC'],
  ['plank', 'Plank'],
  ['tmr', '2MR'],
];

/** The store link for this phone, tagged so installs that came from shared scores show up as their own campaign. */
export function shareLink(os) {
  return os === 'ios' ? appStoreLink('share-ios') : playStoreLink('share-android', 'share');
}

/** True once all five events have a score, the only time a total means anything. */
export function canShareScores(scores) {
  return LABELS.every(([key]) => Number.isFinite(scores[key])) && Number.isFinite(scores.total);
}

/** The message to share, or null when the scores are not all in. `scores` maps event key (and `total`) to points. */
export function buildShareMessage(scores, os) {
  if (!canShareScores(scores)) return null;
  const events = LABELS.map(([key, label]) => `${label} ${scores[key]}`).join(' | ');
  return [
    `I scored ${scores.total}/500 on the Army Fitness Test.`,
    events,
    `Check yours with the free AFT Score Calculator: ${shareLink(os)}`,
  ].join('\n');
}
