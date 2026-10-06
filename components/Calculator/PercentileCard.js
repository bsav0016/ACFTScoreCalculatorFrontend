import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from '../constants';
import { colors, font, radius, space } from '../theme';

const GROUP_STORAGE_KEY = 'aft_percentile_group_by';
const DEFAULT_GROUPS = ['age_bracket', 'scoring_standard'];
const DEBOUNCE_MS = 400;

const GROUP_CHIPS = [
  { key: 'age_bracket', label: 'Age group' },
  { key: 'scoring_standard', label: 'Same scoring standard' },
];

// Display order; `key` matches the metric names the API expects.
const ROWS = [
  { key: 'total', label: 'Overall' },
  { key: 'deadlift', label: 'Deadlift' },
  { key: 'pushups', label: 'T-Push Ups' },
  { key: 'sdc', label: 'SDC' },
  { key: 'plank', label: 'Plank' },
  { key: 'tmr', label: '2MR' },
];

const MISSING_INPUT = { age_bracket: 'age', scoring_standard: 'the scoring standard' };

const ordinal = (n) => {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'}`;
};

const describeCohort = (data, maleOrCombat) => {
  const parts = [];
  if (data.group_by.includes('age_bracket')) parts.push(`ages ${data.age_bracket}`);
  if (data.group_by.includes('scoring_standard')) {
    parts.push(maleOrCombat ? 'male / combat MOS standard' : 'female non-combat standard');
  }
  return parts.length ? parts.join(', ') : 'all AFT scores';
};

/**
 * Live AFT percentile ranking for the scores currently entered in the calculator.
 *
 * `scores` maps metric name -> score for the events the user has filled in (and `total` only once all five
 * are), so we never rank a half-finished total against complete ones. `maleOrCombat` is the calculator's
 * "Male or Combat MOS?" toggle, i.e. the scoring column the scores were computed from.
 */
export default function PercentileCard({ scores, age, maleOrCombat }) {
  const [groupBy, setGroupBy] = useState(DEFAULT_GROUPS);
  const [result, setResult] = useState(null);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(GROUP_STORAGE_KEY)
      .then(stored => { if (stored !== null) setGroupBy(JSON.parse(stored)); })
      .catch(console.log);
  }, []);

  const toggleGroup = (key) => {
    const next = groupBy.includes(key) ? groupBy.filter(g => g !== key) : [...groupBy, key];
    setGroupBy(next);
    AsyncStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(next)).catch(console.log);
  };

  const scoresKey = JSON.stringify(scores);
  useEffect(() => {
    if (Object.keys(scores).length === 0) {
      setResult(null);
      return;
    }

    // Built by hand: React Native's URLSearchParams is only partially implemented.
    const params = { ...scores, group_by: groupBy.join(','), male_or_combat: maleOrCombat };
    const ageNumber = parseInt(age, 10);
    if (ageNumber >= 17 && ageNumber <= 99) params.age = ageNumber;
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

    const thisRequest = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${backendUrl}api/acft_scores/percentiles/?${query}`);
        const data = await res.json();
        if (thisRequest !== requestId.current) return; // a newer request superseded this one
        if (!res.ok) throw new Error(data.message);
        setResult(data);
        setFailed(false);
      } catch (error) {
        if (thisRequest !== requestId.current) return;
        console.log(error);
        setFailed(true);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [scoresKey, age, maleOrCombat, groupBy]);

  const visibleRows = result ? ROWS.filter(row => result.percentiles[row.key]) : [];
  const cohortSize = visibleRows.length ? result.percentiles[visibleRows[0].key].cohort_size : 0;
  const missing = result ? groupBy.filter(g => !result.group_by.includes(g)) : [];

  const overall = result && result.percentiles.total;
  let summary;
  if (Object.keys(scores).length === 0) summary = 'Enter your scores to see how you rank';
  else if (failed) summary = "Couldn't load percentiles right now";
  else if (!result) summary = 'Calculating…';
  else if (!overall) summary = 'Enter all five events for your overall rank';
  else if (overall.percentile === null) summary = 'Not enough data yet';
  else summary = `${ordinal(overall.percentile)} percentile overall`;

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} accessibilityRole="button"
        accessibilityState={{ expanded }} style={styles.summaryRow}>
        <View style={{flex: 1}}>
          <Text style={styles.summaryLabel}>HOW YOU RANK</Text>
          <Text style={overall && overall.percentile !== null ? styles.summaryValue : font.body}>{summary}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▴' : '▾'}</Text>
      </TouchableOpacity>

      {expanded &&
        <View style={{marginTop: space.md}}>
          <View style={styles.chipRow}>
            {GROUP_CHIPS.map(chip => {
              const on = groupBy.includes(chip.key);
              return (
                <TouchableOpacity key={chip.key} onPress={() => toggleGroup(chip.key)}
                  accessibilityState={{ selected: on }}
                  style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{chip.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {result && visibleRows.length > 0 &&
            <View>
              <Text style={[font.caption, {marginBottom: space.sm}]}>
                Compared with {describeCohort(result, maleOrCombat)} ({cohortSize} {cohortSize === 1 ? 'score' : 'scores'})
              </Text>
              {missing.length > 0 &&
                <Text style={[font.caption, {marginBottom: space.sm}]}>
                  Enter {missing.map(g => MISSING_INPUT[g]).join(' and ')} to apply {missing.length === 1 ? 'that grouping' : 'those groupings'}.
                </Text>
              }
              {visibleRows.map(row => {
                const { percentile } = result.percentiles[row.key];
                return (
                  <View key={row.key} style={styles.row}>
                    <View style={styles.rowTop}>
                      <Text style={font.body}>{row.label}</Text>
                      <Text style={percentile === null ? font.caption : styles.rowValue}>
                        {percentile === null ? 'Not enough data' : ordinal(percentile)}
                      </Text>
                    </View>
                    <View style={styles.track}>
                      {percentile !== null && <View style={[styles.fill, { width: `${Math.max(percentile, 2)}%` }]}/>}
                    </View>
                  </View>
                );
              })}
              {visibleRows.some(row => result.percentiles[row.key].percentile === null) &&
                <Text style={[font.caption, {marginTop: space.sm}]}>
                  Needs at least {result.min_cohort_size} scores in the group. Try a broader grouping.
                </Text>
              }
            </View>
          }
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginBottom: space.md,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  summaryLabel: { ...font.caption, fontWeight: '600', letterSpacing: 0.8 },
  summaryValue: { color: colors.gold, fontSize: 18, fontWeight: '700' },
  chevron: { color: colors.textMuted, fontSize: 18, marginLeft: space.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: space.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: space.sm,
    marginBottom: space.sm,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  chipTextOn: { color: colors.onGold, fontWeight: '700' },
  row: { marginTop: space.md },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rowValue: { color: colors.gold, fontSize: 17, fontWeight: '700' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceAlt, marginTop: 6, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.gold },
});
