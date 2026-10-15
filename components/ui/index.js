import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Image, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import Button from '../Button';
import { colors, font, numericKeyboard, radius, scoreColor, space } from '../theme';

// ---- Keeping the focused input above the keyboard
// React Native only scrolls a focused input into view on Android; on iOS it can end up behind the keyboard. A screen
// calls useKeepFocusedVisible(), spreads `scrollProps` onto its ScrollView and provides `ensureVisible` through
// ScrollIntoViewContext. Cards, Fields, LabeledInputs and InputRows then report where they are when focused.
export const ScrollIntoViewContext = createContext(null);
const CardLayoutContext = createContext(null);
const RowFocusContext = createContext(null);

export function useKeepFocusedVisible() {
  const scrollRef = useRef();
  const scrollY = useRef(0);
  const viewHeight = useRef(0);
  const lastRect = useRef(null);

  // rect: { y, height } in the scroll content's coordinates.
  const ensureVisible = (rect) => {
    lastRect.current = rect;
    if (!scrollRef.current || !viewHeight.current) return;
    const margin = 12;
    const top = rect.y;
    const bottom = rect.y + rect.height;
    if (bottom + margin > scrollY.current + viewHeight.current) {
      scrollRef.current.scrollTo({ y: bottom + margin - viewHeight.current, animated: true });
    } else if (top - margin < scrollY.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, top - margin), animated: true });
    }
  };

  // The keyboard shrinks the ScrollView just after focus lands, so look again once it has settled.
  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => { if (lastRect.current) ensureVisible(lastRect.current); }, 100);
    });
    return () => subscription.remove();
  }, []);

  const scrollProps = {
    ref: scrollRef,
    scrollEventThrottle: 16,
    onScroll: (event) => { scrollY.current = event.nativeEvent.contentOffset.y; },
    onLayout: (event) => { viewHeight.current = event.nativeEvent.layout.height; },
  };
  return { scrollProps, ensureVisible };
}

// Reports an input's row position to the screen's scroll handler when the input gains focus.
function useFocusReporter() {
  const scrollIntoView = useContext(ScrollIntoViewContext);
  const cardLayout = useContext(CardLayoutContext);
  const rowLayout = useRef(null);
  return {
    onLayout: (event) => { rowLayout.current = event.nativeEvent.layout; },
    onFocus: () => {
      if (!scrollIntoView || !rowLayout.current) return;
      const cardY = cardLayout ? cardLayout.current.y : 0;
      scrollIntoView({ y: cardY + rowLayout.current.y, height: rowLayout.current.height });
    },
  };
}

export function Card({ style, children, onLayout }) {
  const layout = useRef({ y: 0 });
  return (
    <CardLayoutContext.Provider value={layout}>
      <View
        style={[styles.card, style]}
        onLayout={(event) => {
          layout.current = event.nativeEvent.layout;
          if (onLayout) onLayout(event);
        }}
      >
        {children}
      </View>
    </CardLayoutContext.Provider>
  );
}

export function SectionLabel({ children, style }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

// A labelled numeric input on one row: label on the left, input on the right.
export function Field({ label, value, onChangeText, placeholder, keyboardType = numericKeyboard, inputRef,
  onSubmitEditing, returnKeyType = 'next', secureTextEntry, autoCapitalize }) {
  const focus = useFocusReporter();
  return (
    <View style={styles.fieldRow} onLayout={focus.onLayout}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        ref={inputRef}
        onFocus={focus.onFocus}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        blurOnSubmit={returnKeyType !== 'next'}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={[styles.input, styles.fieldInput]}
      />
    </View>
  );
}

// Full-width text input with its label above (login, registration, ...).
export function LabeledInput({ label, inputRef, style, onFocus, ...inputProps }) {
  const focus = useFocusReporter();
  return (
    <View style={{ marginTop: space.md }} onLayout={focus.onLayout}>
      <Text style={font.caption}>{label}</Text>
      <TextInput
        ref={inputRef}
        placeholderTextColor={colors.textMuted}
        blurOnSubmit={inputProps.returnKeyType !== 'next'}
        style={[styles.input, { marginTop: 6 }, style]}
        {...inputProps}
        onFocus={(event) => {
          focus.onFocus();
          if (onFocus) onFocus(event);
        }}
      />
    </View>
  );
}

// Equal-width pill selector. options: [{ value, label }].
export function Segmented({ options, value, onChange, compact }) {
  return (
    <View style={styles.segmented}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.segment, compact && styles.segmentCompact, selected && styles.segmentSelected]}
          >
            <Text style={[styles.segmentText, compact && styles.segmentTextCompact, selected && styles.segmentTextSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Colour-coded score pill; neutral until the user has entered something for the event.
export function ScoreBadge({ score, entered, small }) {
  const color = entered ? scoreColor(score) : colors.textMuted;
  return (
    <View style={[styles.badge, small && styles.badgeSmall, { borderColor: color }]}>
      <Text style={[styles.badgeText, small && styles.badgeTextSmall, { color }]}>{entered ? score : '—'}</Text>
    </View>
  );
}

// Dark bottom sheet used for score charts and short explanations.
export function ChartModal({ visible, onClose, children }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {children}
          <Button variant="text" title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

// One compact line inside a card: label on the left, input(s) in the middle, optional badge on the right.
export function InputRow({ label, onLabelPress, right, children }) {
  const focus = useFocusReporter();

  return (
    <RowFocusContext.Provider value={focus.onFocus}>
      <View style={styles.inputRow} onLayout={focus.onLayout}>
        <TouchableOpacity disabled={!onLabelPress} onPress={onLabelPress} style={styles.rowLabelWrap}>
          <Text style={styles.rowLabel} numberOfLines={1}>{label}</Text>
        </TouchableOpacity>
        <View style={styles.rowInputs}>{children}</View>
        {right === undefined ? <View style={styles.badgeSpacer} /> : right}
      </View>
    </RowFocusContext.Provider>
  );
}

// Numeric text input sized for InputRow.
export function CompactInput(props) {
  const onRowFocus = useContext(RowFocusContext);
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      keyboardType={numericKeyboard}
      returnKeyType="next"
      {...props}
      onFocus={(event) => {
        if (onRowFocus) onRowFocus();
        if (props.onFocus) props.onFocus(event);
      }}
      style={[styles.input, styles.compactInput, props.style]}
    />
  );
}

// One calculator event on a single line. `field` is the object each calculator already builds for its events.
// Tapping the label or the score opens that event's score chart.
export function EventRow({ field }) {
  const hasSecond = field.key2 !== undefined;
  const entered = field.value !== '' || (hasSecond && field.value2 !== '');
  const openChart = () => field.onPress(true);
  const name = field.text.trim();

  return (
    <InputRow
      label={name}
      onLabelPress={openChart}
      right={
        <TouchableOpacity onPress={openChart} accessibilityLabel={`${name} score chart`}>
          <ScoreBadge score={field.score} entered={entered} small />
        </TouchableOpacity>
      }
    >
      <CompactInput
        ref={field.ref}
        value={field.value}
        onChangeText={field.onCT}
        onSubmitEditing={field.onSE}
        placeholder={field.ph}
        blurOnSubmit={false}
      />
      {hasSecond &&
        <>
          <Text style={styles.colon}>:</Text>
          <CompactInput
            ref={field.ref2}
            value={field.value2}
            onChangeText={field.onCT2}
            onSubmitEditing={field.onSE2}
            placeholder="Seconds"
            returnKeyType={field.bos2 ? 'done' : 'next'}
            blurOnSubmit={field.bos2}
          />
        </>
      }
      <ChartModal visible={!!field.visible} onClose={() => field.onPress(false)}>
        <View style={field.imageStyle}>
          <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
            <Image source={field.imagePath} style={field.imageStyle} />
          </ReactNativeZoomableView>
        </View>
      </ChartModal>
    </InputRow>
  );
}

// Sticky footer with the running total and the Save / Clear actions.
export function TotalBar({ total, max, canSave, onSave, onClear, compact }) {
  if (compact) {
    // Keyboard is up: keep the running total visible but give the space back to the form.
    return (
      <View style={[styles.totalBar, styles.totalBarCompact]}>
        <Text style={font.caption}>TOTAL SCORE</Text>
        <Text style={styles.totalValueCompact}>
          {total}
          <Text style={styles.totalMax}> / {max}</Text>
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.totalBar}>
      <View>
        <Text style={font.caption}>TOTAL SCORE</Text>
        <Text style={styles.totalValue}>
          {total}
          <Text style={styles.totalMax}> / {max}</Text>
        </Text>
      </View>
      <View style={styles.totalActions}>
        <Button variant="text" title="Clear" onPress={onClear} />
        {canSave && <Button title="Save score" onPress={onSave} style={styles.saveButton} />}
      </View>
    </View>
  );
}

// A computed value: label on the left, the number on the right ("—" until the inputs are valid).
export function ResultRow({ label, value, large }) {
  return (
    <View style={styles.resultRow}>
      <Text style={font.body}>{label}</Text>
      <Text style={[styles.resultValue, large && styles.resultValueLarge, value === '—' && { color: colors.textMuted }]}>
        {value}
      </Text>
    </View>
  );
}

// Tappable navigation row used on the home screen.
export function MenuItem({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button" style={styles.menuItem}>
      <View style={{ flex: 1 }}>
        <Text style={font.heading}>{title}</Text>
        {subtitle ? <Text style={[font.caption, { marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// Shared text-input look for screens that build their own forms (login, profile, ...).
export const inputStyle = {
  backgroundColor: colors.surfaceAlt,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: radius.sm,
  color: colors.text,
  fontSize: 17,
  paddingHorizontal: space.md,
  paddingVertical: 12,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.lg,
    marginBottom: space.md,
  },
  sectionLabel: {
    ...font.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: space.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  fieldLabel: { ...font.body, flex: 1 },
  input: { ...inputStyle, textAlign: 'left' },
  fieldInput: { width: 120, textAlign: 'right' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: space.sm,
    borderRadius: radius.md - 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentSelected: { backgroundColor: colors.gold },
  segmentText: { color: colors.textMuted, fontSize: 15, fontWeight: '500', textAlign: 'center' },
  segmentTextSelected: { color: colors.onGold, fontWeight: '700' },
  badge: {
    minWidth: 56,
    paddingVertical: 4,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
  },
  badgeText: { fontSize: 18, fontWeight: '700' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: space.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowLabelWrap: { width: 84, justifyContent: 'center' },
  rowLabel: { ...font.body, fontSize: 15, fontWeight: '600' },
  rowInputs: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0, marginRight: space.sm },
  compactInput: { flex: 1, minWidth: 0, minHeight: 40, paddingVertical: 8, fontSize: 16 },
  badgeSpacer: { width: 52 },
  colon: { ...font.heading, marginHorizontal: 6 },
  segmentCompact: { minHeight: 36, paddingVertical: 6 },
  segmentTextCompact: { fontSize: 14 },
  badgeSmall: { minWidth: 52, paddingVertical: 2, paddingHorizontal: 8 },
  badgeTextSmall: { fontSize: 16 },
  totalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  totalValue: { color: colors.gold, fontSize: 28, fontWeight: '800', lineHeight: 32 },
  totalMax: { color: colors.textMuted, fontSize: 16, fontWeight: '500' },
  totalBarCompact: { paddingVertical: 6 },
  totalValueCompact: { color: colors.gold, fontSize: 20, fontWeight: '800' },
  totalActions: { flexDirection: 'row', alignItems: 'center' },
  saveButton: { marginLeft: space.sm, paddingHorizontal: 18, paddingVertical: 10, minHeight: 44 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: space.lg,
    marginBottom: space.sm,
  },
  chevron: { color: colors.gold, fontSize: 28, marginLeft: space.sm },
  resultRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: space.md },
  resultValue: { color: colors.gold, fontSize: 20, fontWeight: '700' },
  resultValueLarge: { fontSize: 30, fontWeight: '800' },
});

export { Toast, useToast } from './Toast';
