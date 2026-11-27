import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import { EMPTY_SNAPSHOT, buildAnnouncement } from './announce';

// Said once the person has stopped typing, not on every keystroke: a time event is two boxes and a score that flickers
// through wrong values on the way (a "3" before the "30"). Only when a screen reader is on.
export const SETTLE_MS = 1500;

export function useScoreAnnouncements(scores, entered) {
  const announced = useRef(EMPTY_SNAPSHOT);
  const latest = useRef({ scores, entered });
  // A new key each time any score or entered flag changes, so the timer restarts on every change.
  const signature = JSON.stringify([scores, entered]);

  // Declared first so the timer below always reads this render's values.
  useEffect(() => { latest.current = { scores, entered }; });

  useEffect(() => {
    const timer = setTimeout(async () => {
      const current = latest.current;
      const message = buildAnnouncement(announced.current, current);
      announced.current = { scores: { ...current.scores }, entered: { ...current.entered } };
      if (!message) return;
      try {
        if (await AccessibilityInfo.isScreenReaderEnabled()) AccessibilityInfo.announceForAccessibility(message);
      } catch {
        // Announcing is a courtesy; never let it break the calculator.
      }
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [signature]);
}
