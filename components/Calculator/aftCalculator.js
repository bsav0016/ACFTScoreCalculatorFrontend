import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, View, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import ACFTBannerAd from "../ACFTBannerAd";
import * as StoreReview from 'expo-store-review';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import Button from '../Button';
import PercentileCard from './PercentileCard';
import { Card, ChartModal, CompactInput, EventRow, InputRow, ScrollIntoViewContext, Segmented, Toast, TotalBar, useKeepFocusedVisible, useToast } from '../ui';
import { describeSaveResult, validateTestDate } from './saveScore';
import { colors, font, space } from '../theme';
import { backendUrl } from '../constants';
import calculatorStyles from './calculatorStyles';
import { EVENTS, columnFor, scoreFor } from './aftScoring';


const AFTCalculator = (props) => {
  const [isCombatMOS, setIsCombatMOS] = useState(true);
  const [ageText, setAgeText] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [deadliftScore, setDeadliftScore] = useState(0);
  const [pushups, setPushups] = useState('');
  const [pushupScore, setPushupScore] = useState(0);
  const [sdcMin, setSDCMin] = useState('');
  const [sdcSec, setSDCSec] = useState('');
  const [sdcScore, setSDCScore] = useState(0);
  const [plankMin, setPlankMin] = useState('');
  const [plankSec, setPlankSec] = useState('');
  const [plankScore, setPlankScore] = useState(0);
  const [runMin, setRunMin] = useState('');
  const [runSec, setRunSec] = useState('');
  const [runScore, setRunScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [visibleSave, setVisibleSave] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);
  const [dateError, setDateError] = useState('');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const saving = useRef(false);

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2024);

  const deadliftRef = useRef();
  const pushupRef = useRef();
  const sdcMinRef = useRef();
  const sdcSecRef = useRef();
  const plankMinRef = useRef();
  const plankSecRef = useRef();
  const runMinRef = useRef();
  const runSecRef = useRef();

  const [visible,setVisible] = React.useState(false)
  const [visible1,setVisible1] = React.useState(false)
  const [visible3,setVisible3] = React.useState(false)
  const [visible4,setVisible4] = React.useState(false)
  const [visible5,setVisible5] = React.useState(false)
  const [visible6,setVisible6] = React.useState(false)

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { scrollProps, ensureVisible } = useKeepFocusedVisible();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestTrackingPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOpen(false)
    );

    if (Math.random() < 0.1) {
      if (StoreReview.hasAction()) {
        StoreReview.requestReview()
      }
    }

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (ageText.length > 1) {
      deadliftRef.current.focus();
    }
  }, [ageText])

  useEffect(() => {
    const newTotalScore = deadliftScore + pushupScore + sdcScore + plankScore + runScore
    setTotalScore(newTotalScore);
    if (totalScore > 0) {
      setVisibleSave(true)
    }
    else {
      setVisibleSave(false)
    }
  }, [deadliftScore, pushupScore, sdcScore, plankScore, runScore])

  useEffect(() => {
    if (deadlift === '') {
      setDeadliftScore(0);
    }
    else if (isNaN(deadlift)) {
      setDeadlift('');
      setDeadliftScore(0);
      alert("Please enter a number for deadlift");
    }
    else {
      const newDeadliftScore = calculateEventScore(deadlift, 'deadlift');
      setDeadliftScore(newDeadliftScore);
      if (deadlift.toString().length == 3) {
        pushupRef.current.focus()
      }
    }
  }, [deadlift, isCombatMOS])

  useEffect(() => {
    if (pushups === '') {
      setPushupScore(0);
    }
    else if (isNaN(pushups)) {
      setPushups('');
      setPushupScore(0);
      alert("Please enter a number for push ups");
    }
    else {
      const newPushupScore = calculateEventScore(pushups, 'pushups');
      setPushupScore(newPushupScore);
      if (pushups.toString().length == 2) {
        sdcMinRef.current.focus()
      }
    }
  }, [pushups, isCombatMOS])

  useEffect(() => {
    if (sdcMin === '') {
      setSDCScore(0);
    }
    else if (isNaN(sdcMin)) {
      setSDCMin('');
      setSDCScore(0);
      alert("Please enter a number");
    }
    else {
      const sdcTime = timeFormat(sdcMin, sdcSec)
      const newSDCScore = calculateEventScore(sdcTime, 'sdc')
      setSDCScore(newSDCScore);
      sdcSecRef.current.focus()
    }
  }, [sdcMin, isCombatMOS])

  useEffect(() => {
    if (sdcSec === '') {
      setSDCScore(0);
    }
    else if (isNaN(sdcSec)) {
      setSDCSec('');
      setSDCScore(0);
      alert("Please enter a number");
    }
    else {
      const sdcTime = timeFormat(sdcMin, sdcSec)
      const newSDCScore = calculateEventScore(sdcTime, 'sdc');
      setSDCScore(newSDCScore);
      if (sdcSec.toString().length == 2) {
        plankMinRef.current.focus();
      }
    }
  }, [sdcSec, isCombatMOS])

  useEffect(() => {
    if (plankMin === '') {
      setPlankScore(0);
    }
    else if (isNaN(plankMin)) {
      setPlankMin('');
      setPlankScore(0);
      alert("Please enter a number");
    }
    else {
      const newPlankScore = calculateEventScore(timeFormat(plankMin, plankSec), 'plank');
      setPlankScore(newPlankScore);
      plankSecRef.current.focus()
    }
  }, [plankMin, isCombatMOS])

  useEffect(() => {
    if (plankSec === '') {
      setPlankScore(0);
    }
    else if (isNaN(plankSec)) {
      setPlankSec('');
      setPlankScore(0);
      alert("Please enter a number");
    }
    else {
      const newPlankScore = calculateEventScore(timeFormat(plankMin, plankSec), 'plank');
      setPlankScore(newPlankScore);
      if (plankSec.toString().length == 2) {
        runMinRef.current.focus();
      }
    }
  }, [plankSec, isCombatMOS])

  useEffect(() => {
    if (runMin === '') {
      setRunScore(0);
    }
    else if (isNaN(runMin)) {
      setRunMin('');
      setRunScore(0);
      alert("Please enter a number");
    }
    else {
      const newRunScore = calculateEventScore(timeFormat(runMin, runSec), 'tmr');
      setRunScore(newRunScore);
      if (runMin.toString().length == 2) {
        runSecRef.current.focus();
      }
    }
  }, [runMin, isCombatMOS])

  useEffect(() => {
    if (runSec === '') {
      setRunScore(0);
    }
    else if (isNaN(runSec)) {
      setRunSec('');
      setRunScore(0);
      alert("Please enter a number");
    }
    else {
      const newRunScore = calculateEventScore(timeFormat(runMin, runSec), 'tmr');
      setRunScore(newRunScore);
      if (runSec.toString().length == 2) {
        runSecRef.current.blur();
      }
    }
  }, [runSec, isCombatMOS])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('MR_token');
    return token;
  };

  const getId = async () => {
    const id = await AsyncStorage.getItem('user_id');
    return id;
  };

  const verifyLoggedIn = async () => {
    const id = await getId();
    if (id === null) {
      askToLogin();
    }
    else{
      setDateError('');
      setVisibleDate(true);
    }
  }

  const askToLogin = () => {
    Alert.alert("User Not Logged In", "Would you like to go login or register for an account?",
      [
        {
        text: "Yes",
        onPress: () => {props.navigation.navigate("Auth")},
        style: 'destructive'
        },
        {
          text: "No",
          onPress: () => console.log("Cancelled"),
          style: 'cancel'
        }
      ]
    )
  }

  const saveScore = () => {
    // Shown inside the dialog: an alert() raised over a Modal can fail to appear on iOS, which looked like Confirm
    // doing nothing.
    const problem = validateTestDate({ day, month, year });
    if (problem) {
      setDateError(problem);
      return;
    }
    setDateError('');
    let data = {
      standard: 'AFT',
      month: Number(month),
      day: Number(day),
      year: Number(year),
      age: parseInt(ageText, 10),
      male_or_combat: isCombatMOS,
      deadlift_raw: Number(deadlift),
      deadlift_score: deadliftScore,
      pushups_raw: Number(pushups),
      pushups_score: pushupScore,
      sdc_raw: Number(sdcMin) * 60 + Number(sdcSec),
      sdc_score: sdcScore,
      plank_raw: Number(plankMin) * 60 + Number(plankSec),
      plank_score: plankScore,
      tmr_raw: Number(runMin) * 60 + Number(runSec),
      tmr_score: runScore,
      total_score: totalScore
    };
    saveToDatabase(data);
    setVisibleDate(false);
  }

  // Always ends in a toast: saved, the server's reason it was refused, or why the request never completed.
  const saveToDatabase = async (data) => {
    if (saving.current) return;
    saving.current = true;
    let result;
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/acft_scores/1/save_results/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data})
      });
      let body = null;
      try {
        body = await res.json();
      } catch {
        // Not JSON (for example an error page); describeSaveResult falls back to a generic message.
      }
      result = describeSaveResult({ status: res.status, ok: res.ok, body });
    } catch (err) {
      console.log(err);
      result = describeSaveResult({ networkError: true });
    } finally {
      saving.current = false;
    }
    showToast(result.message, result.type);
  }
  
  const timeFormat = (minutes, seconds) => {
    const formattedTime = parseFloat(minutes) + seconds / 60.0;
    return formattedTime;
  }
  
  // Points for a raw result in this event, using the person's age and scoring column. No usable age scores 0.
  const calculateEventScore = (input, eventKey) => {
    const age = parseInt(ageText, 10);
    if (isNaN(age)) return 0;
    const event = EVENTS.find(e => e.key === eventKey);
    return scoreFor(event, input, columnFor(age, isCombatMOS));
  }

  const clearScore = () => {
    setIsCombatMOS(true);
    setAgeText('');
    setDeadlift('');
    setPushups('');
    setSDCMin('');
    setSDCSec('');
    setPlankMin('');
    setPlankSec('');
    setRunMin('');
    setRunSec('');
    setVisibleSave(false);
  }

  // Hand what's been entered to the goal planner (time events in decimal minutes, anything blank as null).
  const openPlanner = () => {
    const count = (value) => (value === '' ? null : Number(value))
    const minutes = (min, sec) => ((min === '' && sec === '') ? null : (Number(min) || 0) + (Number(sec) || 0) / 60)
    props.navigation.navigate('AFTPlanner', {
      age: parseInt(ageText, 10),
      maleOrCombat: isCombatMOS,
      raws: {
        deadlift: count(deadlift),
        pushups: count(pushups),
        sdc: minutes(sdcMin, sdcSec),
        plank: minutes(plankMin, plankSec),
        tmr: minutes(runMin, runSec)
      }
    })
  }

  const fields = [
    {
      key: 'deadlift', text: 'Deadlift', value: deadlift, ref: deadliftRef, ph: '(in lbs)', 
      onCT: setDeadlift, onSE: () => pushupRef.current.focus(), bos: false, visible: visible1, 
      onPress: (isVisible) => {setVisible1(isVisible)}, imagePath: require('../../assets/AFTScoreCharts/AFTDeadliftScores.png'), 
      imageStyle: calculatorStyles.aftDeadliftScoresImage, score: deadliftScore
    },
    {
      key: 'pushups', text: 'T-Push Ups', value: pushups, ref: pushupRef, ph: '0-99',
      onCT: setPushups, onSE: () => sdcMinRef.current.focus(), bos: false, visible: visible3,
      onPress: (isVisible) => {setVisible3(isVisible)}, imagePath: require('../../assets/AFTScoreCharts/AFTPushupScores.png'),
      imageStyle: calculatorStyles.aftPushUpScoresImage, score: pushupScore
    },
    {
      key: 'sdcMin', text: 'SDC', value: sdcMin, ref: sdcMinRef, ph: 'Minutes',
      onCT: setSDCMin, onSE: () => sdcSecRef.current.focus(), bos: false, visible: visible4,
      onPress: (isVisible) => {setVisible4(isVisible)}, imagePath: require('../../assets/AFTScoreCharts/AFTSDCScores.png'),
      imageStyle: calculatorStyles.aftSdcScoresImage, score: sdcScore, key2: 'sdcSec', value2: sdcSec,
      ref2: sdcSecRef, onCT2: setSDCSec, onSE2: () => plankMinRef.current.focus(), bos2: false
    },
    {
      key: 'plankMin', text: 'Plank', value: plankMin, ref: plankMinRef, ph: 'Minutes',
      onCT: setPlankMin, onSE: () => plankSecRef.current.focus(), bos: false, visible: visible5,
      onPress: (isVisible) => {setVisible5(isVisible)}, imagePath: require('../../assets/AFTScoreCharts/AFTPlankScores.png'),
      imageStyle: calculatorStyles.aftPlankScoresImage, score: plankScore, key2: 'plankSec', value2: plankSec,
      ref2: plankSecRef, onCT2: setPlankSec, onSE2: () => runMinRef.current.focus(), bos2: false
    },
    {
      key: 'runMin', text: '2MR', value: runMin, ref: runMinRef, ph: 'Minutes',
      onCT: setRunMin, onSE: () => runSecRef.current.focus(), bos: false, visible: visible6,
      onPress: (isVisible) => {setVisible6(isVisible)}, imagePath: require('../../assets/AFTScoreCharts/AFTRunScores.png'),
      imageStyle: calculatorStyles.aftMRScoresImage, score: runScore, key2: 'runSec', value2: runSec,
      ref2: runSecRef, onCT2: setRunSec, onSE2: () => {}, bos2: true
    }
  ]    

  // Only rank events the user has actually entered; the total only counts once all five are in.
  const enteredEvents = {
    deadlift: deadlift !== '',
    pushups: pushups !== '',
    sdc: sdcMin !== '' || sdcSec !== '',
    plank: plankMin !== '' || plankSec !== '',
    tmr: runMin !== '' || runSec !== ''
  }
  const eventScores = {
    deadlift: deadliftScore, pushups: pushupScore, sdc: sdcScore, plank: plankScore, tmr: runScore
  }
  const percentileScores = {}
  for (const event in enteredEvents) {
    if (enteredEvents[event]) {
      percentileScores[event] = eventScores[event]
    }
  }
  if (Object.values(enteredEvents).every(Boolean)) {
    percentileScores.total = totalScore
  }

  const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Container style={{flex: 1, backgroundColor: colors.bg}} behavior="padding">
      <ScrollView
        {...scrollProps}
        style={{flex: 1}}
        contentContainerStyle={{padding: space.lg}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Dialog.Container visible={visibleDate}>
          <Dialog.Title>Input Test Date</Dialog.Title>
          <Dialog.Description>
            Please input the test date.
          </Dialog.Description>
          <View style={calculatorStyles.inputContainer}>
            <Dialog.Description>Day:</Dialog.Description>
            <Dialog.Input placeholder={"Day"} onChangeText={setDay}/>
          </View>
          <View style={calculatorStyles.inputContainer}>
            <Dialog.Description>Month:</Dialog.Description>
            <Dialog.Input placeholder={"Month (0-12)"} onChangeText={setMonth}/>
          </View>
          <View style={calculatorStyles.inputContainer}>
            <Dialog.Description>Year:</Dialog.Description>
            <Dialog.Input placeholder={"Year"} onChangeText={setYear}/>
          </View>
          {dateError ? <Dialog.Description style={{color: colors.danger}}>{dateError}</Dialog.Description> : null}
          <Dialog.Button label="Cancel" onPress={() => setVisibleDate(false)} />
          <Dialog.Button label="Confirm" onPress={saveScore} />
        </Dialog.Container>

        <ScrollIntoViewContext.Provider value={ensureVisible}>
        <Card style={{paddingVertical: space.md}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: space.sm}}>
            <View style={{flex: 1}}>
              <Segmented
                compact
                options={[
                  {value: true, label: 'Male / Combat MOS'},
                  {value: false, label: 'Female non-combat'}
                ]}
                value={isCombatMOS}
                onChange={setIsCombatMOS}
              />
            </View>
            <TouchableOpacity onPress={() => setInfoModalVisible(true)} accessibilityLabel="Which MOS count as combat?" style={{padding: space.sm}}>
              <Text style={{color: colors.gold, fontSize: 20, fontWeight: '700'}}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          <InputRow label="Age">
            <CompactInput
              value={ageText}
              onChangeText={setAgeText}
              placeholder="17-99"
              blurOnSubmit={false}
              onSubmitEditing={() => deadliftRef.current.focus()}
            />
          </InputRow>
          {fields.map(field => <EventRow key={field.key} field={field}/>)}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border}}>
            <Text style={[font.caption, {flex: 1}]} numberOfLines={1}>Tap a score for its chart</Text>
            <TouchableOpacity onPress={openPlanner} style={{padding: 4, marginLeft: space.sm}}>
              <Text style={{color: colors.gold, fontSize: 13, fontWeight: '700'}}>Goal planner</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(true)} style={{padding: 4, marginLeft: space.sm}}>
              <Text style={{color: colors.gold, fontSize: 13, fontWeight: '500'}}>Alt. events</Text>
            </TouchableOpacity>
          </View>
        </Card>
        </ScrollIntoViewContext.Provider>

        <ChartModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)}>
          <Text style={[font.heading, {marginBottom: space.sm}]}>Male or Combat MOS</Text>
          <Text style={[font.body, {marginBottom: space.sm}]}>Choose the first option if you are male, or if your MOS is a combat MOS (any gender). Otherwise choose the second.</Text>
          <Text style={font.body}>The following are considered Combat MOS: 11A, 11B, 11C, 11Z, 12A, 12B, 13A, 13F, 18A, 180A, 18B, 18C, 18D, 18E, 18F, 18Z, 19A, 19C, 19D, 19K, 19Z</Text>
        </ChartModal>

        <PercentileCard scores={percentileScores} age={ageText} maleOrCombat={isCombatMOS}/>

        <ChartModal visible={visible} onClose={() => setVisible(false)}>
          <View style={calculatorStyles.alternateEventsImage}>
            <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../../assets/AFTScoreCharts/AFTAlternateEventScores.png')} style={calculatorStyles.aftAlternateEventsImage}/>
            </ReactNativeZoomableView>
          </View>
        </ChartModal>
      </ScrollView>
      <TotalBar total={totalScore} max={500} canSave={visibleSave} onSave={verifyLoggedIn} onClear={clearScore} compact={keyboardOpen}/>
      {!keyboardOpen && <ACFTBannerAd/>}
      <Toast toast={toast} onHide={hideToast}/>
    </Container>
  )
}

export default AFTCalculator;
