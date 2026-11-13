import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast, useToast } from './ui';
import { onNotify } from './notify';

function Host() {
  const { toast, showToast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  useEffect(() => onNotify(({ message, type }) => showToast(message, type)), [showToast]);

  // Covers the whole screen without catching touches, and keeps the message below the status bar and notch.
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { paddingTop: insets.top }]}>
      <Toast toast={toast} onHide={hideToast} />
    </View>
  );
}

// Mount once, as the last child of the app's root view, so messages appear in front of every screen.
export default function MessageHost() {
  return (
    <SafeAreaProvider pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Host />
    </SafeAreaProvider>
  );
}
