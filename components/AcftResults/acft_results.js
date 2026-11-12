import { Text, View, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { authFetch, getSession } from '../session';
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { Card, ScoreBadge } from '../ui';
import { colors, font, radius, space } from '../theme';
import TrendChart from './TrendChart';
import { deleteSavedResult } from './deleteResult';
import { AFT_EVENTS, AFT_MAX_TOTAL, buildProgress, formatTime } from './progress';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (item) => `${MONTHS[item.month - 1] || item.month} ${item.day}, ${item.year}`;

const eventsFor = (item) => {
  const events = [
    { label: 'Deadlift', raw: `${item.deadlift_raw} lbs`, score: item.deadlift_score },
  ];
  if (item.standard !== 'AFT') {
    events.push({ label: 'Ball Throw', raw: `${item.spt_raw} m`, score: item.spt_score });
  }
  events.push(
    { label: 'T-Push Ups', raw: `${item.pushups_raw} reps`, score: item.pushups_score },
    { label: 'SDC', raw: formatTime(item.sdc_raw, item.standard), score: item.sdc_score },
    { label: 'Plank', raw: formatTime(item.plank_raw, item.standard), score: item.plank_score },
    { label: '2MR', raw: formatTime(item.tmr_raw, item.standard), score: item.tmr_score },
  );
  return events;
};

const signed = (n) => (n > 0 ? `+${n}` : String(n));
const deltaColor = (n) => (n > 0 ? colors.success : n < 0 ? colors.danger : colors.textMuted);

function Summary({ progress }) {
  const { latest, previous, totalDelta, bestTotal, weakest, series, comparable, bests } = progress;
  if (!latest) return null;
  return (
    <Card>
      <Text style={font.caption}>Latest AFT total</Text>
      <View style={styles.cardHeader}>
        <Text style={styles.total}>
          {latest.total_score}
          <Text style={styles.totalMax}> / {AFT_MAX_TOTAL}</Text>
        </Text>
        {totalDelta !== null && (
          <Text style={[font.heading, {color: deltaColor(totalDelta)}]}>{signed(totalDelta)}</Text>
        )}
      </View>
      {previous && !comparable && (
        <Text style={[font.caption, {marginBottom: space.sm}]}>
          Your last two tests were scored on different tables, so the change is approximate.
        </Text>
      )}
      <TrendChart series={series}/>
      <View style={styles.eventRow}>
        <Text style={[font.body, {flex: 1}]}>Best total</Text>
        <Text style={font.heading}>{bestTotal.total_score}</Text>
      </View>
      {weakest && (
        <View style={styles.eventRow}>
          <Text style={[font.body, {flex: 1}]}>Weakest event</Text>
          <Text style={[font.caption, {marginRight: space.md}]}>{weakest.label}</Text>
          <ScoreBadge score={weakest.score} entered={true}/>
        </View>
      )}
      {series.length > 1 && (
        <>
          <Text style={[font.caption, {marginTop: space.md}]}>Best score per event</Text>
          {AFT_EVENTS.map(({ key, label }) => (
            <View key={key} style={styles.eventRow}>
              <Text style={[font.body, {flex: 1}]}>{label}</Text>
              <ScoreBadge score={bests[key].score} entered={true}/>
            </View>
          ))}
        </>
      )}
    </Card>
  );
}

export default function ACFTResults(props) {

  const [acftResults, setAcftResults] = useState([]);


  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    const session = await getSession();
    if (session) {
        if (first) {
            setData(session.id)
        }
    } else {
        console.log("No login")
        props.navigation.navigate("Auth")
    }
  };

  const setData = (id) => {
    // authFetch forgets the stored login on a 401 (ended or expired), so the login screen doesn't bounce straight back.
    authFetch(`api/users/${id}/`)
    .then( res => res.json())
    .then( async res => {
        if (res.username === undefined) {
          alert("Couldn't get your saved scores")
          props.navigation.navigate("Auth")
        }
        else {
          setAcftResults(res.acft_results)
        }
    })
    .catch( error => console.log(error))
  }

  const deleteAcftResult = async (id) => {
    const result = await deleteSavedResult(authFetch, id)
    if (result.ok) {
      setAcftResults((current) => current.filter((r) => r.id !== id))
      return
    }
    alert(result.message)
    if (result.signedOut) props.navigation.navigate("Auth")
  }

  const confirmDelete = (item) => {
    Alert.alert("Delete this score?", "This saved score will be removed from your account.", [
      { text: "Delete", style: "destructive", onPress: () => deleteAcftResult(item.id) },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const progress = useMemo(() => buildProgress(acftResults), [acftResults]);
  // Newest AFT first, then a heading and the retired ACFT results.
  const rows = useMemo(() => {
    const list = [...progress.aft].reverse();
    if (progress.acft.length) list.push({ id: 'acft-heading', heading: true }, ...progress.acft);
    return list;
  }, [progress]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{padding: space.lg}}
        ListHeaderComponent={<Summary progress={progress}/>}
        ListEmptyComponent={<Text style={[font.caption, {textAlign: 'center', marginTop: space.xl}]}>No saved scores yet.</Text>}
        renderItem={({item}) => {
          if (item.heading) {
            return <Text style={[font.heading, {marginTop: space.lg, marginBottom: space.sm}]}>Retired ACFT results</Text>;
          }
          const isAft = item.standard === 'AFT';
          const change = progress.changes[item.id];
          return (
            <Card>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={font.heading}>{formatDate(item)}</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{isAft ? 'AFT' : 'ACFT'}</Text>
                  </View>
                  {change && change.delta !== null && (
                    <Text style={[font.caption, {color: deltaColor(change.delta), marginTop: 4}]}>
                      {signed(change.delta)} since previous test{change.comparable ? '' : ' (different scoring table)'}
                    </Text>
                  )}
                </View>
                <Text style={styles.total}>
                  {item.total_score}
                  <Text style={styles.totalMax}> / {isAft ? 500 : 600}</Text>
                </Text>
              </View>

              {eventsFor(item).map(event => (
                <View key={event.label} style={styles.eventRow}>
                  <Text style={[font.body, {flex: 1}]}>{event.label}</Text>
                  <Text style={[font.caption, {marginRight: space.md}]}>{event.raw}</Text>
                  <ScoreBadge score={event.score} entered={true}/>
                </View>
              ))}

              <Button variant="text" title="Delete" onPress={() => confirmDelete(item)}
                textStyle={{color: colors.danger}} style={{alignSelf: 'flex-end', marginTop: space.sm}}/>
            </Card>
          );
        }}
      />
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.sm },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  tagText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  total: { color: colors.gold, fontSize: 32, fontWeight: '800' },
  totalMax: { color: colors.textMuted, fontSize: 16, fontWeight: '500' },
  eventRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
});
