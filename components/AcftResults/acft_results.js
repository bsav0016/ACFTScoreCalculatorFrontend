import { Text, View, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import ACFTBannerAd from '../ACFTBannerAd';
import { backendUrl } from '../constants';
import Button from '../Button';
import { Card, ScoreBadge } from '../ui';
import { colors, font, radius, space } from '../theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// AFT results store plain seconds. ACFT results saved by the app join "minutes * 60" and the seconds as text
// (1:45 -> 6045), so they decode differently.
const formatTime = (raw, standard) => {
  const minutes = standard === 'AFT' ? Math.floor(raw / 60) : Math.floor(raw / 6000);
  const seconds = raw % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

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

// Newest test first.
const byDateDescending = (a, b) =>
  (b.year - a.year) || (b.month - a.month) || (b.day - a.day) || (b.id - a.id);


export default function ACFTResults(props) {

  const [acftResults, setAcftResults] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [itemNo, setItemNo] = useState(0);
  const [visible, setVisible] = useState(false)


  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    const storedToken = await AsyncStorage.getItem('MR_token');
    setToken(storedToken);
    let id = await AsyncStorage.getItem('user_id');
    if (id) {
        if (first) {
            setData(id, storedToken)
        }
    } else {
        console.log("No token")
        props.navigation.navigate("Auth")
    }
  };

  const setData = (id, authToken) => {
    fetch(`${backendUrl}api/users/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        }
    })
    .then( res => res.json())
    .then( async res => {
        if (res.username === undefined) {
          // Usually an expired or invalid login: clear it so the login screen doesn't bounce straight back.
          await AsyncStorage.removeItem('MR_token');
          await AsyncStorage.removeItem('user_id');
          alert("Couldn't get your saved scores")
          props.navigation.navigate("Auth")
        }
        else {
          setUsername(res.username)
          setAcftResults(res.acft_results)
        }
    })
    .catch( error => console.log(error))
  }

  const checkPassword = () => {
    fetch(`${backendUrl}api/authenticate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then( res => res.json())
    .then( res => {
        if (res.token) {
            deleteAcftResult()
        }
        else {
            alert("Incorrect password")
        }
    })
    .catch( error => console.log(error))
    setVisible(false)
  }

  const deleteAcftResult = () => {
    let newAcftResults = []
    for(let i = 0; i < acftResults.length; i++){
        if (!(acftResults[i].id === itemNo)) {
            newAcftResults.push(acftResults[i])
        }
    }
    fetch(`${backendUrl}api/acft_scores/${itemNo}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    })
    .then( () => {
        setAcftResults(newAcftResults)
        getData(false)
    })
    .catch( error => console.log(error))
  }

  const passwordInput = (value) => {
    setPassword(value)
  }

  const showDialog = (item) => {
      setVisible(true)
      setItemNo(item.id)
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Confirm with Password</Dialog.Title>
        <Dialog.Description>
          Please input your password to delete this score.
        </Dialog.Description>
        <Dialog.Input placeholder={"Password"} onChangeText={passwordInput}/>
        <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
        <Dialog.Button label="Confirm" onPress={() => checkPassword()} />
      </Dialog.Container>

      <FlatList
        data={[...acftResults].sort(byDateDescending)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{padding: space.lg}}
        ListEmptyComponent={<Text style={[font.caption, {textAlign: 'center', marginTop: space.xl}]}>No saved scores yet.</Text>}
        renderItem={({item}) => {
          const isAft = item.standard === 'AFT';
          return (
            <Card>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={font.heading}>{formatDate(item)}</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{isAft ? 'AFT' : 'ACFT'}</Text>
                  </View>
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

              <Button variant="text" title="Delete" onPress={() => showDialog(item)}
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
