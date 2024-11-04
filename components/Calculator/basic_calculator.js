import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import ACFTBannerAd from "../ACFTBannerAd";
import * as StoreReview from 'expo-store-review';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { backendUrl } from '../constants';
import calculatorStyles from './calculatorStyles';
import ballThrowScores from './Scores/ballThrowScores';
import deadliftScores from './Scores/deadliftScores';
import plankScores from './Scores/plankScores';
import pushupScores from './Scores/pushupScores';
import runScores from './Scores/runScores';
import SDCScores from './Scores/SDCScores';


const ModalPopup = ({visible, children}) => {
  const [showModal,setShowModal] = React.useState(visible)

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if(visible){
      setShowModal(true)
    }
    else{
      setShowModal(false)
    }
  }

  return <Modal transparent visible={showModal}>
    <View style={calculatorStyles.modalBackground}>
      <View style= {[calculatorStyles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const BasicCalculator = (props) => {
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [deadliftScore, setDeadliftScore] = useState(0);
  const [pushups, setPushups] = useState('');
  const [pushupScore, setPushupScore] = useState(0);
  const [ballThrow, setBallThrow] = useState('');
  const [ballThrowScore, setBallThrowScore] = useState(0);
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

  const [visibleSave, setVisibleSave] = useState(false)
  const [visibleDate, setVisibleDate] = useState(false)

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2024);

  const ageRef = useRef();
  const deadliftRef = useRef();
  const pushupRef = useRef();
  const ballThrowRef = useRef();
  const sdcMinRef = useRef();
  const sdcSecRef = useRef();
  const plankMinRef = useRef();
  const plankSecRef = useRef();
  const runMinRef = useRef();
  const runSecRef = useRef();

  const [visible,setVisible] = React.useState(false)
  const [visible1,setVisible1] = React.useState(false)
  const [visible2,setVisible2] = React.useState(false)
  const [visible3,setVisible3] = React.useState(false)
  const [visible4,setVisible4] = React.useState(false)
  const [visible5,setVisible5] = React.useState(false)
  const [visible6,setVisible6] = React.useState(false)

  const [keyboardOpen, setKeyboardOpen] = useState(false);

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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const newTotalScore = deadliftScore + pushupScore + ballThrowScore + sdcScore + plankScore + runScore
    setTotalScore(newTotalScore);
    if (totalScore > 0) {
      setVisibleSave(true)
    }
    else {
      setVisibleSave(false)
    }
  }, [deadliftScore, ballThrowScore, pushupScore, sdcScore, plankScore, runScore])

  useEffect(() => {
    if (gender === '' || gender === null) {
      setGender('');
    }
    else if (gender !== 'M' && gender !== 'm' && gender !== 'f' && gender !== 'F') {
      alert("Gender must be set to M or F");
      setGender('');
    }
    else {
      ageRef.current.focus()
    }
    if (Math.random() < 0.03) {
      if (StoreReview.hasAction()) {
        StoreReview.requestReview()
      }
    }
  }, [gender])

  useEffect(() => {
    if (age === '' || age === null) {
      setAge(0);
    }
    else if (isNaN(Number(age)) || age < 0) {
      alert("Age must be a non-negative number");
      setAge(0);
    }
    else if (age.toString().length == 2) {
      deadliftRef.current.focus()
    }
  }, [age])

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
      const newDeadliftScore = calculateEventScore(deadlift, true, deadliftScores);
      setDeadliftScore(newDeadliftScore);
      if (deadlift.toString().length == 3) {
        ballThrowRef.current.focus()
      }
    }
  }, [deadlift, gender, age])

  useEffect(() => {
    if (ballThrow === '') {
      setBallThrowScore(0);
    }
    else if (isNaN(ballThrow)) {
      setBallThrow('');
      setBallThrowScore(0);
      alert("Please enter a number for ball throw");
    }
    else {
      const newBallThrowScore = calculateEventScore(ballThrow, true, ballThrowScores);
      setBallThrowScore(newBallThrowScore);
      const splitBallThrow = ballThrow.toString().split('.')
      if (splitBallThrow.length == 2) {
        if (splitBallThrow[1].length == 1) {
          pushupRef.current.focus()
        }
      }
    }
  }, [ballThrow, gender, age])

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
      const newPushupScore = calculateEventScore(pushups, true, pushupScores);
      setPushupScore(newPushupScore);
      if (pushups.toString().length == 2) {
        sdcMinRef.current.focus()
      }
    }
  }, [pushups, gender, age])

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
      sdcTime = timeFormat(sdcMin, sdcSec)
      const newSDCScore = calculateEventScore(sdcTime, false, SDCScores)
      setSDCScore(newSDCScore);
      sdcSecRef.current.focus()
    }
  }, [sdcMin, gender, age])

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
      sdcTime = timeFormat(sdcMin, sdcSec)
      const newSDCScore = calculateEventScore(sdcTime, false, SDCScores);
      setSDCScore(newSDCScore);
      if (sdcSec.toString().length == 2) {
        plankMinRef.current.focus();
      }
    }
  }, [sdcSec, gender, age])

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
      const newPlankScore = calculateEventScore(timeFormat(plankMin, plankSec), true, plankScores);
      setPlankScore(newPlankScore);
      plankSecRef.current.focus()
    }
  }, [plankMin, gender, age])

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
      const newPlankScore = calculateEventScore(timeFormat(plankMin, plankSec), true, plankScores);
      setPlankScore(newPlankScore);
      if (plankSec.toString().length == 2) {
        runMinRef.current.focus()
      }
    }
  }, [plankSec, gender, age])

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
      const newRunScore = calculateEventScore(timeFormat(runMin, runSec), false, runScores);
      setRunScore(newRunScore);
      if (runMin.toString().length == 2) {
        runSecRef.current.focus()
      }
    }
  }, [runMin, gender, age])

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
      const newRunScore = calculateEventScore(timeFormat(runMin, runSec), false, runScores);
      setRunScore(newRunScore);
      if (runSec.toString().length == 2) {
        runSecRef.current.blur()
      }
    }
  }, [runSec, gender, age])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('MR_token');
    return token
  };

  const getId = async () => {
    id = await AsyncStorage.getItem('user_id')
    return id
  };

  const verifyLoggedIn = async () => {
    const id = await getId()
    if (id === null) {
      askToLogin()
    }
    else{
      setVisibleDate(true)
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
    if (isNaN(Number(day)) || day < 0 || Number.isInteger(day) || day > 31) {
      alert("Day must be between 1 and 31");
      return;
    }
    else if (isNaN(Number(month)) || month < 1 || Number.isInteger(month) || month > 12) {
      alert("Month must be between 1 and 12");
      return;
    }
    else if (isNaN(Number(year)) || Number.isInteger(year) || year < 2022) {
      alert("Year must be at least 2022");
      return;
    }
    let data = {
      month: month,
      day: day,
      year: year,
      gender: gender,
      age: age,
      deadlift_raw: deadlift,
      deadlift_score: deadliftScore,
      spt_raw: ballThrow,
      spt_score: ballThrowScore, 
      pushups_raw: pushups, 
      pushups_score: pushupScore,
      sdc_raw: sdcMin * 60 + sdcSec, 
      sdc_score: sdcScore, 
      plank_raw: plankMin * 60 + plankSec, 
      plank_score: plankScore,
      tmr_raw: runMin * 60 + runSec, 
      tmr_score: runScore, 
      total_score: totalScore
    }
    saveToDatabase(data)
    setVisibleDate(false)
  }

  const saveToDatabase = async (data) => {
    const token = await getToken()
    await fetch(`${backendUrl}/api/acft_scores/1/save_results/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data})
    })
    .then( res => res.json())
    .then( jsonRes => {
      if (jsonRes.message !== 'Stored ACFT score') {
        alert(jsonRes.message)
      }
      else {
        alert("Score successfully saved")
      }
    })
    .catch( err => {
      console.log(err)
    })
  }
  
  const timeFormat = (minutes, seconds) => {
    formattedTime = parseFloat(minutes) + seconds / 60.0
    return formattedTime
  }
  
  const calculateEventScore = (input, above, scoresArray) => {
    const ageGroups = [
      { maxAge: 22, maleIndex: 1, femaleIndex: 2 },
      { maxAge: 27, maleIndex: 3, femaleIndex: 4 },
      { maxAge: 32, maleIndex: 5, femaleIndex: 6 },
      { maxAge: 37, maleIndex: 7, femaleIndex: 8 },
      { maxAge: 42, maleIndex: 9, femaleIndex: 10 },
      { maxAge: 47, maleIndex: 11, femaleIndex: 12 },
      { maxAge: 52, maleIndex: 13, femaleIndex: 14 },
      { maxAge: 57, maleIndex: 15, femaleIndex: 16 },
      { maxAge: 62, maleIndex: 17, femaleIndex: 18 },
      { maxAge: Infinity, maleIndex: 19, femaleIndex: 20 }
    ];
  
    const genderIndex = gender.toLowerCase() === 'm' ? 'maleIndex' : 'femaleIndex';
    const comparison = above ? (a, b) => a >= b : (a, b) => a <= b;

    for (const group of ageGroups) {
      if (age < group.maxAge) {
        const index = group[genderIndex];
        for (const score of scoresArray) {
          if (comparison(input, score[index])) {
            return score[0];
          }
        }
      }
    }
    return 0;
  }

  const clearScore = () => {
    setGender('')
    setAge('')
    setDeadlift('')
    setBallThrow('')
    setPushups('')
    setSDCMin('')
    setSDCSec('')
    setPlankMin('')
    setPlankSec('')
    setRunMin('')
    setRunSec('')
  }

  const fields = [
    { 
      key: 'deadlift', text: 'Deadlift       ', value: deadlift, ref: deadliftRef, ph: '(in lbs)', 
      onCT: setDeadlift, onSE: () => ballThrowRef.current.focus(), bos: false, visible: visible1, 
      onPress: (isVisible) => {setVisible1(isVisible)}, imagePath: require('../../assets/DeadliftScores.png'), 
      imageStyle: calculatorStyles.deadliftScoresImage, score: deadliftScore
    },
    {
      key: 'ballThrow', text: 'Ball Throw  ', value: ballThrow, ref: ballThrowRef, ph: 'e.g. 11.4',
      onCT: setBallThrow, onSE: () => pushupRef.current.focus(), bos: false, visible: visible2,
      onPress: (isVisible) => {setVisible2(isVisible)}, imagePath: require('../../assets/BallThrowScores.png'),
      imageStyle: calculatorStyles.ballThrowScoresImage, score: ballThrowScore
    },
    {
      key: 'pushups', text: 'T-Push Ups', value: pushups, ref: pushupRef, ph: '0-99',
      onCT: setPushups, onSE: () => sdcMinRef.current.focus(), bos: false, visible: visible3,
      onPress: (isVisible) => {setVisible3(isVisible)}, imagePath: require('../../assets/PushupScores.png'),
      imageStyle: calculatorStyles.pushUpScoresImage, score: pushupScore
    },
    {
      key: 'sdcMin', text: 'SDC', value: sdcMin, ref: sdcMinRef, ph: 'Minutes',
      onCT: setSDCMin, onSE: () => sdcSecRef.current.focus(), bos: false, visible: visible4,
      onPress: (isVisible) => {setVisible4(isVisible)}, imagePath: require('../../assets/SDCScores.png'),
      imageStyle: calculatorStyles.sdcScoresImage, score: sdcScore, key2: 'sdcSec', value2: sdcSec,
      ref2: sdcSecRef, onCT2: setSDCSec, onSE2: () => plankMinRef.current.focus(), bos2: false
    },
    {
      key: 'plankMin', text: 'Plank', value: plankMin, ref: plankMinRef, ph: 'Minutes',
      onCT: setPlankMin, onSE: () => plankSecRef.current.focus(), bos: false, visible: visible5,
      onPress: (isVisible) => {setVisible5(isVisible)}, imagePath: require('../../assets/PlankScores.png'),
      imageStyle: calculatorStyles.plankScoresImage, score: plankScore, key2: 'plankSec', value2: plankSec,
      ref2: plankSecRef, onCT2: setPlankSec, onSE2: () => runMinRef.current.focus(), bos2: false
    },
    {
      key: 'runMin', text: '2MR', value: runMin, ref: runMinRef, ph: 'Minutes',
      onCT: setRunMin, onSE: () => runSecRef.current.focus(), bos: false, visible: visible6,
      onPress: (isVisible) => {setVisible6(isVisible)}, imagePath: require('../../assets/2MRScores.png'),
      imageStyle: calculatorStyles.MRScoresImage, score: runScore, key2: 'runSec', value2: runSec,
      ref2: runSecRef, onCT2: setRunSec, onSE2: () => {}, bos2: true
    }
  ]    

  const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Container style={calculatorStyles.container1}
        behavior="padding">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardDismissMode='none'>
          <View style={[calculatorStyles.container, {marginTop: keyboardOpen ? 10 : 25}]}>

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
              <Dialog.Button label="Cancel" onPress={() => setVisibleDate(false)} />
              <Dialog.Button label="Confirm" onPress={saveScore} />
            </Dialog.Container>

            <Text>Gender:</Text>
            <TextInput
              key='gender'
              value={gender}
              returnKeyType='next'
              style={calculatorStyles.input}
              placeholderTextColor="gray"
              placeholder="M or F"
              onChangeText={setGender}
              onSubmitEditing={() => ageRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     Age:</Text>
            <TextInput
              key='age'
              value={age}
              keyboardType="numeric"
              returnKeyType='done'
              ref={ageRef}
              style={calculatorStyles.input}
              placeholderTextColor="gray"
              placeholder="0-99"
              onChangeText={setAge}
              onSubmitEditing={() => deadliftRef.current.focus()}
              blurOnSubmit={false}/>
          </View>

          {fields.map(field => (
            <View style={[calculatorStyles.container, {marginTop: keyboardOpen ? 10 : 25}]} key={field.key}>
              <Text>{field.text}</Text>
              <TextInput
                key={field.key}
                value={field.value}
                keyboardType='numeric'
                returnKeyType='done'
                ref={field.ref}
                style={calculatorStyles.input}
                placeholder={field.ph}
                placeholderTextColor='gray'
                onChangeText={field.onCT}
                onSubmitEditing={field.onSE}
                blurOnSubmit={field.bos}
              />
              {field.key2 &&
                <Text>:</Text>
              }
              {field.key2 &&
                <TextInput
                  key={field.key2}
                  value={field.value2}
                  keyboardType="numeric"
                  returnKeyType='done'
                  ref={field.ref2}
                  style={calculatorStyles.input}
                  placeholder="Seconds"
                  placeholderTextColor="gray"
                  onChangeText={field.onCT2}
                  onSubmitEditing={field.onSE2}
                  blurOnSubmit={field.bos2}/>
              }
              <Text>     </Text>
              <ModalPopup visible={field.visible}>
                <View style={{alignItems:'center', justifyContent: 'center'}}>
                  <View style={calculatorStyles.header}>
                    <TouchableOpacity onPress={() => {field.onPress(false)}}>
                      <Image source={require('../../assets/x.png')} style={calculatorStyles.xOut}/>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={field.imageStyle}>
                  <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
                    <Image source={field.imagePath} style={field.imageStyle}/>
                  </ReactNativeZoomableView>
                </View>

              </ModalPopup>
              <TouchableOpacity onPress={() => {field.onPress(true)}} style={calculatorStyles.button}>
                <Text style={calculatorStyles.buttonText}>Score:</Text>
              </TouchableOpacity>
              <Text>{field.score}</Text>
            </View>
          ))}

          <View style={calculatorStyles.container}>
            <Text>Total Score: {totalScore}</Text>
            {visibleSave && 
              <TouchableOpacity onPress={() => verifyLoggedIn()} style={calculatorStyles.button}>
                  <Text style={calculatorStyles.buttonText}>Save Score</Text>
              </TouchableOpacity>
            }
          </View>
          
          <View style={calculatorStyles.container}>
            <TouchableOpacity onPress={clearScore} style={calculatorStyles.button}>
              <Text style={calculatorStyles.buttonText}>Clear Score</Text>
            </TouchableOpacity>
          </View>
          
          <ModalPopup visible={visible}>
            <View style={{alignItems:'center'}}>
              <View style={calculatorStyles.header}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Image source={require('../../assets/x.png')} style={calculatorStyles.xOut}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={calculatorStyles.alternateEventsImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
                <Image source={require('../../assets/AlternateEvents.png')} style={calculatorStyles.alternateEventsImage}/>
              </ReactNativeZoomableView>
            </View>

          </ModalPopup>
          <TouchableOpacity onPress={() => {setVisible(true)}} style={calculatorStyles.altButton}>
            <Text style={calculatorStyles.buttonText}>Alternate Event Standards</Text>
          </TouchableOpacity>
        </ScrollView>
        <ACFTBannerAd/>
      </Container>
    </TouchableWithoutFeedback>
  )
}

BasicCalculator.navigationOptions = screenProps => ({
  title: "Score Calculator",
  headerStyle: {
    backgroundColor: '#FEC029'
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#000'
  },
  backgroundColor: '#000'
})

export default BasicCalculator;
