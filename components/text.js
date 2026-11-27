import React from 'react';
import { Text as NativeText, TextInput as NativeTextInput, useWindowDimensions } from 'react-native';

// Every screen takes its Text and TextInput from here, not from react-native (a lint rule enforces it), so text follows
// the phone's text-size setting up to a limit. Without a limit the largest settings push the fixed-size pieces (score
// badges, the total bar, the input boxes) off the screen; at 2x everything still fits.
export const MAX_FONT_SCALE = 2;

// From this scale up, rows that sit side by side (label | input | score) stack instead, so each part gets the full width.
export const LARGE_TEXT_FROM = 1.3;

export function Text(props) {
  return <NativeText maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />;
}

// React 19 passes `ref` through as an ordinary prop, so the callers' input refs (focus(), ...) still reach the input.
export function TextInput(props) {
  return <NativeTextInput maxFontSizeMultiplier={MAX_FONT_SCALE} {...props} />;
}

// True when the phone's text size is set large. Re-renders when the setting changes.
export function useLargeText() {
  return useWindowDimensions().fontScale >= LARGE_TEXT_FROM;
}
