import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { Card, Field, ScoreBadge } from '../ui';
import { colors, font, radius, space } from '../theme';
import { EVENTS, MAX_TOTAL, columnFor, describeChange, formatRaw, rawNeeded, scoreFor, spreadPoints } from './aftScoring';

const isEntered = (raw) => raw !== null && raw !== undefined && !Number.isNaN(raw);

/**
 * "What do I need?": given the results entered on the AFT calculator, works out what it takes to reach a target total.
 * The extra points are split evenly across the events (any mix that adds up works), then each event's score table is
 * read in reverse for the result that earns them.
 *
 * route.params: { age, maleOrCombat, raws: { deadlift, pushups, sdc, plank, tmr } }, with time events in decimal
 * minutes and anything not entered as null.
 */
export default function AFTPlanner(props) {
  const { age, maleOrCombat, raws } = (props.route && props.route.params) || {};
  const validAge = Number.isInteger(age) && age >= 17 && age <= 99;
  const column = validAge ? columnFor(age, !!maleOrCombat) : null;

  const rows = EVENTS.map(event => {
    const raw = raws ? raws[event.key] : null;
    const entered = validAge && isEntered(raw);
    return { event, raw, entered, score: entered ? scoreFor(event, raw, column) : 0 };
  });
  const total = rows.reduce((sum, row) => sum + row.score, 0);

  const [targetText, setTargetText] = useState(String(Math.min(MAX_TOTAL, (Math.floor(total / 25) + 1) * 25)));

  if (!validAge) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={styles.empty}>
          <Text style={font.heading}>Enter your age first</Text>
          <Text style={[font.caption, { textAlign: 'center', marginVertical: space.md }]}>
            The planner needs your age to know which scoring table to use.
          </Text>
          <Button variant="secondary" title="Back to calculator" onPress={() => props.navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const target = parseInt(targetText, 10);
  const validTarget = Number.isInteger(target) && target > total && target <= MAX_TOTAL;
  const extra = validTarget
    ? spreadPoints(Object.fromEntries(rows.map(row => [row.event.key, row.score])), target)
    : null;

  const plan = rows.map(row => {
    const goal = extra ? row.score + extra[row.event.key] : row.score;
    const need = extra && extra[row.event.key] > 0 ? rawNeeded(row.event, goal, column) : null;
    return { ...row, goal, need };
  });
  const planTotal = plan.reduce((sum, row) => sum + (row.need ? row.need.score : row.score), 0);

  const setQuick = (value) => setTargetText(String(Math.min(MAX_TOTAL, value)));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.lg }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <Card>
          <View style={styles.summaryRow}>
            <View>
              <Text style={font.caption}>YOUR TOTAL</Text>
              <Text style={styles.big}>{total}<Text style={styles.bigMax}> / {MAX_TOTAL}</Text></Text>
            </View>
            <Text style={[font.caption, { textAlign: 'right', flexShrink: 1 }]}>
              Age {age}{'\n'}{maleOrCombat ? 'Male / Combat MOS' : 'Female non-combat'} standard
            </Text>
          </View>
        </Card>

        <Card>
          <Text style={font.heading}>Your goal</Text>
          <Field label="Target total" value={targetText} onChangeText={setTargetText} placeholder={String(MAX_TOTAL)}
            returnKeyType="done" />
          <View style={styles.chips}>
            {[25, 50].map(points => (
              <TouchableOpacity key={points} onPress={() => setQuick(total + points)} style={styles.chip}>
                <Text style={styles.chipText}>+{points}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setQuick(MAX_TOTAL)} style={styles.chip}>
              <Text style={styles.chipText}>Max {MAX_TOTAL}</Text>
            </TouchableOpacity>
          </View>
          {!validTarget &&
            <Text style={[font.caption, { marginTop: space.sm, color: colors.danger }]}>
              {total >= MAX_TOTAL ? "You're already at the maximum." : `Enter a target from ${total + 1} to ${MAX_TOTAL}.`}
            </Text>
          }
        </Card>

        {validTarget &&
          <Card>
            <Text style={font.heading}>To reach {target} (+{target - total})</Text>
            <Text style={[font.caption, { marginBottom: space.sm }]}>
              The points are split evenly across your events. Any mix that adds up works.
            </Text>

            {plan.map(row => {
              const gain = extra[row.event.key];
              return (
                <View key={row.event.key} style={styles.planRow}>
                  <View style={styles.planTop}>
                    <Text style={[font.body, { fontWeight: '600', flex: 1 }]}>{row.event.label}</Text>
                    <ScoreBadge score={row.score} entered={row.entered} small />
                    <Text style={styles.arrow}>→</Text>
                    <ScoreBadge score={row.need ? row.need.score : row.score} entered={row.entered || !!row.need} small />
                  </View>
                  <Text style={font.caption}>
                    {gain === 0
                      ? (!row.entered
                        ? 'Not entered yet, so it counts as 0 points.'
                        : row.score >= 100 ? 'Already maxed out.' : 'Keep this one where it is.')
                      : !row.need
                        ? 'No result earns these points in your age group.'
                        : row.entered
                          ? `Need ${formatRaw(row.event, row.need.raw)} (${describeChange(row.event, row.raw, row.need.raw)}), you did ${formatRaw(row.event, row.raw)}.`
                          : `Need ${formatRaw(row.event, row.need.raw)}.`}
                  </Text>
                </View>
              );
            })}

            <Text style={[font.caption, { marginTop: space.md }]}>
              Requirements are rounded to whole pounds, reps and seconds. This plan scores {planTotal}.
            </Text>
          </Card>
        }
      </ScrollView>
      <ACFTBannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  big: { color: colors.gold, fontSize: 36, fontWeight: '800' },
  bigMax: { color: colors.textMuted, fontSize: 18, fontWeight: '500' },
  chips: { flexDirection: 'row', marginTop: space.md },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: space.sm,
  },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  planRow: {
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  planTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  arrow: { color: colors.textMuted, fontSize: 16, marginHorizontal: space.sm },
});
