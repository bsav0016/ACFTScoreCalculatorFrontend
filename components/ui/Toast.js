import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, space } from '../theme';

// A short message that slides in at the top of the screen, stays a few seconds and fades out. It is a plain view, so it
// shows in front of the screen's own content but not in front of a Modal; close any dialog before showing one.
//
//   const { toast, showToast, hideToast } = useToast();
//   showToast('Score saved.', 'success');   // or 'error' (stays a little longer) or 'info'
//   <Toast toast={toast} onHide={hideToast} />   // as the last child of the screen's root view

const HOLD_MS = { success: 2500, info: 2500, error: 5000 };

export function useToast() {
  const [toast, setToast] = useState(null);
  const counter = useRef(0);
  const showToast = useCallback((message, type = 'info') => {
    counter.current += 1;
    setToast({ id: counter.current, message, type });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);
  return { toast, showToast, hideToast };
}

export function Toast({ toast, onHide }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!toast) return undefined;
    AccessibilityInfo.announceForAccessibility(toast.message);
    progress.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(HOLD_MS[toast.type] || HOLD_MS.info),
      Animated.timing(progress, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => {
      if (finished && onHide) onHide();
    });
    return () => animation.stop();
  }, [toast, onHide, progress]);

  if (!toast) return null;
  const accent = toast.type === 'success' ? colors.success : toast.type === 'error' ? colors.danger : colors.gold;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      style={[
        styles.wrap,
        { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }] },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: accent }]}>
        <Text style={styles.message}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: space.md,
    left: space.lg,
    right: space.lg,
    zIndex: 10,
    ...Platform.select({ android: { elevation: 10 } }),
  },
  toast: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  message: { ...font.body },
});
