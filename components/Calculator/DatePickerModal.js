import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../Button';
import { colors, font, radius, space } from '../theme';
import { MIN_YEAR } from './saveScore';
import {
  MONTH_NAMES, WEEKDAYS, addMonths, canShowMonth, clampDay, formatPickedDate, isAfter, monthGrid, todayParts,
} from './calendar';

/**
 * Calendar for choosing the test date. It opens on `value` ({ year, month, day }, today by default in the caller),
 * does not allow future days, and calls onConfirm with the picked date.
 */
export default function DatePickerModal({ visible, value, error, onCancel, onConfirm, confirmLabel = 'Confirm' }) {
  const today = todayParts();
  const [shown, setShown] = useState({ year: value.year, month: value.month });
  const [picked, setPicked] = useState(value);

  // Reopen on the date the caller passes in (today) instead of wherever the last use left off.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setShown({ year: value.year, month: value.month });
    setPicked(value);
  }

  const move = (delta) => {
    const next = addMonths(shown, delta);
    if (!canShowMonth(next, today, MIN_YEAR)) return;
    setShown(next);
    setPicked((current) => ({ ...next, day: clampDay(current.day, next, today) }));
  };

  const weeks = monthGrid(shown.year, shown.month);
  const canGoBack = canShowMonth(addMonths(shown, -1), today, MIN_YEAR);
  const canGoForward = canShowMonth(addMonths(shown, 1), today, MIN_YEAR);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={font.heading}>Test date</Text>
          <Text style={[font.caption, { marginBottom: space.md }]}>{formatPickedDate(picked)}</Text>

          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => move(-1)} disabled={!canGoBack} accessibilityRole="button"
              accessibilityLabel="Previous month" hitSlop={10} style={[styles.arrow, !canGoBack && styles.arrowOff]}>
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={font.heading}>{MONTH_NAMES[shown.month - 1]} {shown.year}</Text>
            <TouchableOpacity onPress={() => move(1)} disabled={!canGoForward} accessibilityRole="button"
              accessibilityLabel="Next month" hitSlop={10} style={[styles.arrow, !canGoForward && styles.arrowOff]}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.week}>
            {WEEKDAYS.map((label, i) => (
              <Text key={i} style={styles.weekday}>{label}</Text>
            ))}
          </View>

          {weeks.map((week, w) => (
            <View key={w} style={styles.week}>
              {week.map((day, i) => {
                if (day === null) return <View key={i} style={styles.cell} />;
                const date = { year: shown.year, month: shown.month, day };
                const future = isAfter(date, today);
                const selected = picked.year === date.year && picked.month === date.month && picked.day === day;
                const isToday = today.year === date.year && today.month === date.month && today.day === day;
                return (
                  <TouchableOpacity key={i} style={styles.cell} disabled={future}
                    onPress={() => setPicked(date)} accessibilityRole="button"
                    accessibilityLabel={formatPickedDate(date)} accessibilityState={{ selected, disabled: future }}>
                    <View style={[styles.day, selected && styles.daySelected, !selected && isToday && styles.dayToday]}>
                      <Text style={[styles.dayText, selected && styles.dayTextSelected, future && styles.dayTextOff]}>{day}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {error ? <Text style={[font.caption, { color: colors.danger, marginTop: space.sm }]}>{error}</Text> : null}

          <View style={styles.buttons}>
            <Button variant="text" title="Cancel" onPress={onCancel} />
            <Button title={confirmLabel} onPress={() => onConfirm(picked)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const CELL = `${100 / 7}%`;

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: space.lg },
  sheet: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, borderWidth: 1, borderColor: colors.border },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  arrow: { width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  arrowOff: { opacity: 0.3 },
  arrowText: { color: colors.gold, fontSize: 24, lineHeight: 28, fontWeight: '700' },
  week: { flexDirection: 'row' },
  weekday: { width: CELL, textAlign: 'center', color: colors.textMuted, fontSize: 12, fontWeight: '700', paddingVertical: 6 },
  cell: { width: CELL, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  day: { width: '84%', aspectRatio: 1, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: colors.gold },
  dayToday: { borderWidth: 1, borderColor: colors.gold },
  dayText: { color: colors.text, fontSize: 15 },
  dayTextSelected: { color: colors.onGold, fontWeight: '700' },
  dayTextOff: { color: colors.textMuted, opacity: 0.35 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: space.md },
});
