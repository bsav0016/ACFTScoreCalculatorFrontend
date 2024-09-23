import React, {useState, useRef} from 'react';
import { Image, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Modal, Alert } from 'react-native';
import ACFTBannerAd from "./ACFTBannerAd";
import SplashScreen from 'expo-splash-screen';
import * as StoreReview from 'expo-store-review';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

var deadliftScore = 0
var pushupScore = 0
var ballThrowScore = 0
var sdcScore = 0
var sdcMinute = 10
var sdcSecond = 0
var plankScore = 0
var plankMinute = 0
var plankSecond = 0
var runScore = 0
var runMinute = 50
var runSecond = 0
var totalScore = 0
var gender = ''
var age = -1

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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup1 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup2 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup3 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup4 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup5 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

const ModalPopup6 = ({visible, children}) => {
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
    <View style={styles.modalBackground}>
      <View style= {[styles.modalContainer]}>
        {children}
      </View>
    </View>
  </Modal>
}

export default function BasicCalculator(props) {
  const [deadlift, setDeadlift] = useState(0);
  const [pushups, setPushups] = useState(0);
  const [ballThrow, setBallThrow] = useState(0);
  const [sdcMin, setSDCMin] = useState(0);
  const [sdcSec, setSDCSec] = useState(0);
  const [plankMin, setPlankMin] = useState(0);
  const [plankSec, setPlankSec] = useState(0);
  const [runMin, setRunMin] = useState(0);
  const [runSec, setRunSec] = useState(0);
  const [ageNew, setAgeNew] = useState(0);
  const [genderNew, setGenderNew] = useState(0);

  const [visibleSave, setVisibleSave] = useState(false)
  const [visibleDate, setVisibleDate] = useState(false)

  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2022);

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
      verifyPayment()
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

  const verifyPayment = async () => {
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/${id}/`, {
    //fetch(`http://192.168.0.180:8000/api/users/${id}/`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then( res => res.json())
  .then( res => {
      if (res.paid_fee !== true) {
        askToPayFee()
      }
      else {
        setVisibleDate(true)
      }
  })
  .catch( error => console.log(error))
  }

  const askToPayFee = () => {
    Alert.alert("Action Not Authorized", "This is a paid feature. If you know the developer, reach out to him directly to waive the fee. Otherwise, click Confirm to go to the payment page.",
      [
        {
        text: "Yes",
        onPress: () => {props.navigation.navigate("Profile")},
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
        sdc_raw: sdcMin*60+sdcSec, 
        sdc_score: sdcScore, 
        plank_raw: plankMin*60+plankSec, 
        plank_score: plankScore,
        tmr_raw: runMin*60+runSec, 
        tmr_score: runScore, 
        total_score: totalScore
    }
    performCalculation(data)
    setVisibleDate(false)
  }

  const performCalculation = async (data) => {
    const token = await getToken()
    console.log(token)
    await fetch(`https://updated-acft-score-calculator.herokuapp.com/api/acft_scores/1/save_results/`, {
    //await fetch(`http://192.168.0.180:8000/api/acft_scores/1/save_results/`, {
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

  const calculateScore = () => {
    totalScore = deadliftScore+pushupScore+ballThrowScore+sdcScore+plankScore+runScore
    if (totalScore > 0) {
        setVisibleSave(true)
    }
    else {
        setVisibleSave(false)
    }
  }

  const updateAllScores = (deadliftNew, pushupsNew, ballThrowNew) => {
    updateDeadlift(deadliftNew)
    updatePushUps(pushupsNew)
    updateBallThrow(ballThrowNew)
    updateSDCMinute(sdcMinute)
    updatePlankMinute(plankMinute)
    updateRunMinute(runMinute)
    calculateScore()
  }

  const updateDeadlift = (deadlift) => {
    // Check that gender and age are set
    var deadliftUpdate = 0
    if (isNaN(deadlift) && deadlift !== "") {
      deadliftScore = 0
      alert("Please enter a number for deadlift")
    }
  
    // Ensure what's being typed makes sense
    else if (deadlift !== "" || deadlift !== null) {
      deadliftUpdate = Number(deadlift)
      if (isNaN(deadliftUpdate)) {
        deadliftUpdate = 0
      }
      else {
      // Perform calculations here
        deadliftScore = calculateDeadliftScore(deadliftUpdate)
      }
    }
  }
  
  const updatePushUps = (pushups) => {
    // Check that gender and age are set
    var pushupsUpdate = 0
    if (isNaN(pushups) && pushups !== "") {
      pushupScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (pushups !== "" || pushups !== null) {
      pushupsUpdate = Number(pushups)
      if (isNaN(pushupsUpdate)) {
        pushupsUpdate = 0
      }
      else {
      // Perform calculations here
        pushupScore = calculatePushupScore(pushupsUpdate)
      }
    }
  }
  
  const updateBallThrow = (ballThrow) => {
    // Check that gender and age are set
    var ballThrowUpdate = 0
    if (isNaN(ballThrow) && ballThrow !== "") {
      ballThrowScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (ballThrow !== "" || ballThrow !== null) {
      ballThrowUpdate = Number(ballThrow)
      if (isNaN(ballThrowUpdate)) {
        ballThrowUpdate = 0
      }
      else {
      // Perform calculations here
        ballThrowScore = calculateBallThrowScore(ballThrowUpdate)
      }
    }
  }
  
  const updateSDCMinute = (sdc) => {
    // Check that gender and age are set
    var sdcUpdate = 50
    if (isNaN(sdc) && sdc !== "") {
      sdcScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (sdc !== "" || sdc !== null) {
      sdcUpdate = Number(sdc)
      if (isNaN(sdcUpdate)) {
        sdcMinute = sdcUpdate
      }
      else {
      // Perform calculations here
        sdcMinute = sdcUpdate
        sdcScore = calculateSDCScore(t(sdcMinute,sdcSecond))
      }
    }
  }
  
  const updateSDCSecond = (sdc) => {
    // Check that gender and age are set
    var sdcUpdate = 0
    if (isNaN(sdc) && sdc !== "") {
      sdcScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (sdc !== "" || sdc !== null) {
      sdcUpdate = Number(sdc)
      if (isNaN(sdcUpdate)) {
        sdcUpdate = 0
      }
      else {
      // Perform calculations here
        sdcSecond = sdcUpdate
        sdcScore = calculateSDCScore(t(sdcMinute,sdcSecond))
      }
    }
  }
  
  const updatePlankMinute = (plank) => {
    // Check that gender and age are set
    var plankUpdate = 0
    if (isNaN(plank) && plank !== "") {
      plankScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (plank !== "" || plank !== null) {
      plankUpdate = Number(plank)
      if (isNaN(plankUpdate)) {
        plankUpdate = 0
      }
      else {
      // Perform calculations here
        plankMinute = plankUpdate
        plankScore = calculatePlankScore(t(plankMinute,plankSecond))
      }
    }
  }
  
  const updatePlankSecond = (plank) => {
    // Check that gender and age are set
    var plankUpdate = 0
    if (isNaN(plank) && plank !== "") {
      plankScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (plank !== "" || plank !== null) {
      plankUpdate = Number(plank)
      if (isNaN(plankUpdate)) {
        plankUpdate = 0
      }
      else {
      // Perform calculations here
        plankSecond = plankUpdate
        plankScore = calculatePlankScore(t(plankMinute,plankSecond))
      }
    }
  }
  
  const updateRunMinute = (run) => {
    // Check that gender and age are set
    var runUpdate = 50
    if (isNaN(run) && run !== "") {
      runScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (run !== "" || run !== null) {
      runUpdate = Number(run)
      if (isNaN(runUpdate)) {
        runMinute = runUpdate
      }
      else {
      // Perform calculations here
        runMinute = runUpdate
        runScore = calculateRunScore(t(runMinute,runSecond))
      }
    }
  }
  
  const updateRunSecond = (run) => {
    // Check that gender and age are set
    var runUpdate = 0
    if (isNaN(run) && run !== "") {
      runScore = 0
      alert("Please enter a number")
    }
  
    // Ensure what's being typed makes sense
    else if (run !== "" || run !== null) {
      runUpdate = Number(run)
      if (isNaN(runUpdate)) {
        runUpdate = 0
      }
      else {
      // Perform calculations here
        runSecond = runUpdate
        runScore = calculateRunScore(t(runMinute,runSecond))
      }
    }
  }

  const dayInput = (value) => {
    if (value === '' || value === null) {
        setDay(1)
    }
    else if (isNaN(Number(value)) || value < 0 || Number.isInteger(value) || value > 31) {
        alert("Day must be a non-negative integer less than 32")
    }
    else {
        setDay(value)
    }
  }

  const monthInput = (value) => {
    if (value === '' || value === null) {
        setMonth(1)
    }
    else if (isNaN(Number(value)) || value < 0 || Number.isInteger(value) || value > 12) {
        alert("Month must be a non-negative integer less than 13")
    }
    else {
        setMonth(value)
    }
  }

  const yearInput = (value) => {
    if (value === '' || value === null) {
        setYear(2022)
    }
    else if (isNaN(Number(value)) || value < 0 || Number.isInteger(value) || value > 2022) {
        alert("Year must be 2022")
    }
    else {
        setYear(value)
    }
  }

  if (Platform.OS === 'ios') {

    const { granted } = requestTrackingPermissionsAsync()

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container1}
          behavior="padding">

          <View style={styles.container}>

            <Dialog.Container visible={visibleDate}>
              <Dialog.Title>Input Test Date</Dialog.Title>
              <Dialog.Description>
                Please input the test date.
              </Dialog.Description>
              <Dialog.Input placeholder={"Day"} onChangeText={dayInput}/>
              <Dialog.Input placeholder={"Month (0-12)"} onChangeText={monthInput}/>
              <Dialog.Input placeholder={"Year"} onChangeText={yearInput}/>
              <Dialog.Button label="Cancel" onPress={() => setVisibleDate(false)} />
              <Dialog.Button label="Confirm" onPress={saveScore} />
            </Dialog.Container>

            <Text>Gender:</Text>
            <TextInput
              returnKeyType='next'
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="M or F"
              onChangeText={(val) => {setGender(val), setGenderNew(val), updateAllScores(deadlift,pushups,ballThrow)}}
              onSubmitEditing={() => ageRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     Age:</Text>
            <TextInput
              returnKeyType='next'
              ref={ageRef}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="0-99"
              onChangeText={(val) => {setAge(val), setAgeNew(val), updateAllScores(deadlift,pushups,ballThrow)}}
              onSubmitEditing={() => deadliftRef.current.focus()}
              blurOnSubmit={false}/>
          </View>

          <View style={styles.container}>
            <Text>Deadlift       </Text>
            <TextInput
              returnKeyType='next'
              ref={deadliftRef}
              style={styles.input}
              placeholder="(in lbs)"
              placeholderTextColor="gray"
              onChangeText={(val) => {setDeadlift(val), updateDeadlift(val), calculateScore()}}
              onSubmitEditing={() => ballThrowRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup1 visible={visible1}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible1(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.deadliftScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/DeadliftScores.png')} style={styles.deadliftScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup1>
            <TouchableOpacity onPress={() => {setVisible1(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{deadliftScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Ball Throw  </Text>
            <Text  style={styles.smallText}>  </Text>
            <TextInput
              returnKeyType='next'
              ref={ballThrowRef}
              style={styles.input}
              placeholder="e.g. 11.4"
              placeholderTextColor="gray"
              onChangeText={(val) => {updateBallThrow(val), calculateScore(), setBallThrow(val)}}
              onSubmitEditing={() => pushupRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup3 visible={visible3}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible3(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.ballThrowScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/BallThrowScores.png')} style={styles.ballThrowScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup3>
            <TouchableOpacity onPress={() => {setVisible3(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{ballThrowScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>T-Push Ups</Text>
            <Text  style={styles.smallText}> </Text>
            <TextInput
              returnKeyType='next'
              ref={pushupRef}
              style={styles.input}
              placeholder="0-99"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPushups(val), updatePushUps(val), calculateScore()}}
              onSubmitEditing={() => sdcMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup2 visible={visible2}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible2(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pushUpScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/PushupScores.png')} style={styles.pushUpScoresImage}/>
              </ReactNativeZoomableView>
              </View>
              
            </ModalPopup2>
            <TouchableOpacity onPress={() => {setVisible2(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{pushupScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>SDC  </Text>
            <Text  style={styles.smallText}> </Text>
            <TextInput
              returnKeyType='next'
              ref={sdcMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setSDCMin(val), updateSDCMinute(val), calculateScore()}}
              onSubmitEditing={() => sdcSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={sdcSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setSDCSec(val), updateSDCSecond(val), calculateScore()}}
              onSubmitEditing={() => plankMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup4 visible={visible4}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible4(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sdcScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/SDCScores.png')} style={styles.sdcScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup4>
            <TouchableOpacity onPress={() => {setVisible4(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{sdcScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Plank</Text>
            <Text  style={styles.smallText}>  </Text>
            <TextInput
              returnKeyType='next'
              ref={plankMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPlankMin(val), updatePlankMinute(val), calculateScore()}}
              onSubmitEditing={() => plankSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={plankSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPlankSec(val), updatePlankSecond(val), calculateScore()}}
              onSubmitEditing={() => runMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup5 visible={visible5}>
              <View style={{alignItems:'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible5(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.plankScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/PlankScores.png')} style={styles.plankScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup5>
            <TouchableOpacity onPress={() => {setVisible5(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{plankScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>2MR  </Text>
            <TextInput
              returnKeyType='next'
              ref={runMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setRunMin(val), updateRunMinute(val), calculateScore()}}
              onSubmitEditing={() => runSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={runSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setRunSec(val), updateRunSecond(val), calculateScore()}}
              blurOnSubmit={true}/>
            <Text>     </Text>
            <ModalPopup6 visible={visible6}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible6(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.MRScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/2MRScores.png')} style={styles.MRScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup6>
            <TouchableOpacity onPress={() => {setVisible6(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{runScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Total Score: {totalScore}</Text>
            {visibleSave ? 
                <TouchableOpacity onPress={() => verifyLoggedIn()} style={styles.button}>
                    <Text style={styles.buttonText}>Save Score</Text>
                </TouchableOpacity>
                : <></>}
          </View>

          <ModalPopup visible={visible}>
            <View style={{alignItems:'center'}}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Image source={require('../assets/x.png')} style={styles.x}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.alternateEventsImage}>
            <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
            <Image source={require('../assets/AlternateEvents.png')} style={styles.alternateEventsImage}/>
            </ReactNativeZoomableView>
            </View>

          </ModalPopup>
          <TouchableOpacity onPress={() => {setVisible(true)}} style={styles.altButton}>
            <Text style={styles.buttonText}>Alternate Event Standards</Text>
          </TouchableOpacity>

          <ACFTBannerAd/>


        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }

  else {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container1}
          behavior="padding">

          <View style={styles.container}>

            <Dialog.Container visible={visibleDate}>
              <Dialog.Title>Input Test Date</Dialog.Title>
              <Dialog.Description>
                Please input the test date.
              </Dialog.Description>
              <Dialog.Input placeholder={"Day"} onChangeText={dayInput}/>
              <Dialog.Input placeholder={"Month (0-12)"} onChangeText={monthInput}/>
              <Dialog.Input placeholder={"Year"} onChangeText={yearInput}/>
              <Dialog.Button label="Cancel" onPress={() => setVisibleDate(false)} />
              <Dialog.Button label="Confirm" onPress={saveScore} />
            </Dialog.Container>

            <Text>Gender:</Text>
            <TextInput
              returnKeyType='next'
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="M or F"
              onChangeText={(val) => {setGender(val), setGenderNew(val), updateAllScores(deadlift,pushups,ballThrow)}}
              onSubmitEditing={() => ageRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     Age:</Text>
            <TextInput
              returnKeyType='next'
              ref={ageRef}
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="0-99"
              onChangeText={(val) => {setAge(val), setAgeNew(val), updateAllScores(deadlift,pushups,ballThrow)}}
              onSubmitEditing={() => deadliftRef.current.focus()}
              blurOnSubmit={false}/>
          </View>

          <View style={styles.container}>
            <Text>Deadlift       </Text>
            <TextInput
              returnKeyType='next'
              ref={deadliftRef}
              style={styles.input}
              placeholder="(in lbs)"
              placeholderTextColor="gray"
              onChangeText={(val) => {setDeadlift(val), updateDeadlift(val), calculateScore()}}
              onSubmitEditing={() => ballThrowRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup1 visible={visible1}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible1(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.deadliftScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/DeadliftScores.png')} style={styles.deadliftScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup1>
            <TouchableOpacity onPress={() => {setVisible1(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{deadliftScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Ball Throw  </Text>
            <Text  style={styles.smallText}>  </Text>
            <TextInput
              returnKeyType='next'
              ref={ballThrowRef}
              style={styles.input}
              placeholder="e.g. 11.4"
              placeholderTextColor="gray"
              onChangeText={(val) => {updateBallThrow(val), calculateScore(), setBallThrow(val)}}
              onSubmitEditing={() => pushupRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup3 visible={visible3}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible3(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.ballThrowScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/BallThrowScores.png')} style={styles.ballThrowScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup3>
            <TouchableOpacity onPress={() => {setVisible3(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{ballThrowScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>T-Push Ups</Text>
            <Text  style={styles.smallText}> </Text>
            <TextInput
              returnKeyType='next'
              ref={pushupRef}
              style={styles.input}
              placeholder="0-99"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPushups(val), updatePushUps(val), calculateScore()}}
              onSubmitEditing={() => sdcMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup2 visible={visible2}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible2(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pushUpScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/PushupScores.png')} style={styles.pushUpScoresImage}/>
              </ReactNativeZoomableView>
              </View>
              
            </ModalPopup2>
            <TouchableOpacity onPress={() => {setVisible2(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{pushupScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>SDC  </Text>
            <Text  style={styles.smallText}> </Text>
            <TextInput
              returnKeyType='next'
              ref={sdcMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setSDCMin(val), updateSDCMinute(val), calculateScore()}}
              onSubmitEditing={() => sdcSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={sdcSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setSDCSec(val), updateSDCSecond(val), calculateScore()}}
              onSubmitEditing={() => plankMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup4 visible={visible4}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible4(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sdcScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/SDCScores.png')} style={styles.sdcScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup4>
            <TouchableOpacity onPress={() => {setVisible4(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{sdcScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Plank</Text>
            <Text  style={styles.smallText}>  </Text>
            <TextInput
              returnKeyType='next'
              ref={plankMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPlankMin(val), updatePlankMinute(val), calculateScore()}}
              onSubmitEditing={() => plankSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={plankSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setPlankSec(val), updatePlankSecond(val), calculateScore()}}
              onSubmitEditing={() => runMinRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>     </Text>
            <ModalPopup5 visible={visible5}>
              <View style={{alignItems:'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible5(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.plankScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/PlankScores.png')} style={styles.plankScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup5>
            <TouchableOpacity onPress={() => {setVisible5(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{plankScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>2MR  </Text>
            <TextInput
              returnKeyType='next'
              ref={runMinRef}
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor="gray"
              onChangeText={(val) => {setRunMin(val), updateRunMinute(val), calculateScore()}}
              onSubmitEditing={() => runSecRef.current.focus()}
              blurOnSubmit={false}/>
            <Text>:</Text>
            <TextInput
              returnKeyType='next'
              ref={runSecRef}
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor="gray"
              onChangeText={(val) => {setRunSec(val), updateRunSecond(val), calculateScore()}}
              blurOnSubmit={true}/>
            <Text>     </Text>
            <ModalPopup6 visible={visible6}>
              <View style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setVisible6(false)}>
                    <Image source={require('../assets/x.png')} style={styles.x}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.MRScoresImage}>
              <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
              <Image source={require('../assets/2MRScores.png')} style={styles.MRScoresImage}/>
              </ReactNativeZoomableView>
              </View>

            </ModalPopup6>
            <TouchableOpacity onPress={() => {setVisible6(true)}} style={styles.button}>
              <Text style={styles.buttonText}>Score:</Text>
            </TouchableOpacity>
            <Text>{runScore}</Text>
          </View>

          <View style={styles.container}>
            <Text>Total Score: {totalScore}</Text>
            {visibleSave ? 
                <TouchableOpacity onPress={() => verifyLoggedIn()} style={styles.button}>
                    <Text style={styles.buttonText}>Save Score</Text>
                </TouchableOpacity>
                : <></>}
          </View>

          <ModalPopup visible={visible}>
            <View style={{alignItems:'center'}}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Image source={require('../assets/x.png')} style={styles.x}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.alternateEventsImage}>
            <ReactNativeZoomableView bindToBorders={true} maxZoom={3} minZoom={1}>
            <Image source={require('../assets/AlternateEvents.png')} style={styles.alternateEventsImage}/>
            </ReactNativeZoomableView>
            </View>

          </ModalPopup>
          <TouchableOpacity onPress={() => {setVisible(true)}} style={styles.altButton}>
            <Text style={styles.buttonText}>Alternate Event Standards</Text>
          </TouchableOpacity>

          <ACFTBannerAd/>

        </View>
      </TouchableWithoutFeedback>
    );
  }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container1: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 30,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    paddingTop: 4,
    paddingLeft: 6,
    paddingBottom: 2,
    margin: 3,
    width: 70,
    fontSize: 14
  },
  button: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 1,
    margin: 1
  },
  saveButton: {
    justifyContent: 'center',
    borderRadius: 2,
    padding: 2,
    margin: 1,
    marginLeft: 20,
    backgroundColor: '#00f',
    borderColor: '#000',
    borderWidth: 2
  },
  altButton: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 1,
    paddingBottom: 10
  },
  buttonText: {
    fontSize: 14,
    color: '#00f',
    textDecorationLine: 'underline'
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff'
  },
  smallText: {
    fontSize: 4
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '99%',
    backgroundColor: 'white',
    paddingTop: 3,
    paddingBottom: 10,
    elevation: 30
  },
  x: {
    height: 20,
    width: 20
  },
  header: {
    width: '100%',
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15
  },
  alternateEventsImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1938/499
  },
  deadliftScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1170/1277
  },
  ballThrowScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1171/1128,
  },
  pushUpScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1164/1282
  },
  sdcScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1167/1121
  },
  plankScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1176/1121
  },
  MRScoresImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1170/1124
  }
});

function setGender(newGender) {
  if (newGender === '' || newGender === null) {
    gender = ''
  }
  else if (newGender !== 'M' && newGender !== 'm' && newGender !== 'f' && newGender !== 'F') {
    alert("Gender must be set to M or F")
  }
  else {
    gender = newGender
  }
  if (Math.random() < 0.05) {
    if (StoreReview.hasAction()) {
      StoreReview.requestReview()
    }
  }
}

function setAge(newAge) {
  if (newAge === '' || newAge === null) {
    age = -1
  }
  else if (isNaN(Number(newAge)) || newAge < 0) {
    alert("Age must be a non-negative number")
  }
  else {
    age = newAge
  }
}

function t(minute, second) {
  const total = minute + second/60
  return total
}

const pushupScores = [[100,57,53,61,50,62,48,60,47,59,41,56,36,55,35,51,30,46,24,43,24,100],
[99,56,50,60,49,59,45,59,46,57,39,55,34,53,34,48,28,43,23,41,23,99],
[98,54,47,57,46,56,42,56,43,54,36,53,31,50,31,45,26,40,22,39,22,98],
[97,53,45,54,43,55,39,54,40,53,34,50,30,47,30,43,25,38,21,37,21,97],
[96,51,43,53,42,53,38,53,37,51,33,48,28,44,27,40,24,37,20,35,20,96],
[95,50,42,52,39,52,36,52,36,48,31,46,26,42,25,38,23,35,19,34,19,95],
[94,49,39,50,37,51,35,50,35,46,28,44,24,41,24,35,22,34,18,33,18,94],
[93,48,100,49,36,49,34,48,34,45,27,43,23,39,23,34,20,33,100,31,100,93],
[92,47,38,48,35,48,33,47,32,44,26,42,22,38,22,33,19,31,17,30,17,92],
[91,46,37,47,34,47,32,45,31,43,23,41,21,36,21,32,18,30,16,29,16,91],
[90,45,36,46,33,46,30,44,30,42,22,38,20,34,20,31,17,29,15,26,15,90],
[89,44,35,45,32,45,28,43,28,41,100,37,100,33,19,30,100,26,14,24,14,89],
[88,43,34,44,31,44,27,42,26,39,21,36,19,100,18,28,16,25,100,100,100,88],
[87,42,33,43,30,43,26,41,25,38,100,34,18,32,100,27,15,24,100,23,100,87],
[86,41,32,42,28,42,25,40,100,37,20,33,17,31,17,26,100,23,100,100,13,86],
[85,100,31,41,27,41,100,39,24,34,100,32,16,30,16,25,14,100,100,22,100,85],
[84,40,30,40,26,40,24,38,100,33,19,100,100,29,15,24,100,22,13,21,100,84],
[83,39,29,38,25,38,23,36,23,32,18,31,15,28,14,23,100,21,100,20,100,83],
[82,38,28,37,24,37,22,34,100,100,17,30,100,27,100,100,13,20,100,19,100,82],
[81,100,100,100,100,36,100,33,22,31,100,29,14,25,13,22,100,19,100,18,100,81],
[80,37,27,35,100,35,21,100,19,30,16,28,100,23,100,21,100,18,100,17,100,80],
[79,36,26,34,23,34,20,32,100,29,15,27,13,22,100,20,100,100,100,16,12,79],
[78,35,25,33,22,33,19,100,18,28,14,26,100,100,100,19,100,17,100,100,100,78],
[77,34,24,32,21,32,18,31,100,27,100,25,100,21,100,18,100,100,12,15,100,77],
[76,33,23,31,19,100,17,30,100,26,13,23,100,100,100,17,100,16,100,14,100,76],
[75,32,22,100,100,31,100,29,17,25,100,22,100,20,100,100,100,15,100,100,100,75],
[74,100,21,100,18,30,16,28,16,24,100,21,100,19,12,16,12,100,100,13,100,74],
[73,31,100,30,100,29,100,26,15,23,100,20,12,18,100,100,100,14,100,100,100,73],
[72,30,20,27,17,27,15,24,14,22,12,100,100,17,100,15,100,100,100,100,100,72],
[71,29,19,26,16,26,100,23,100,21,100,19,100,16,100,14,100,13,100,12,100,71],
[70,28,18,25,15,23,14,22,13,20,100,18,100,15,100,100,100,100,100,100,100,70],
[69,27,17,22,14,21,100,21,100,19,100,17,100,14,100,13,100,100,100,100,11,69],
[68,25,16,21,13,100,13,20,100,17,100,16,100,13,100,100,100,12,100,11,100,68],
[67,24,100,100,100,100,100,19,100,16,11,15,11,100,11,12,11,100,11,100,100,67],
[66,23,15,20,100,20,100,17,12,15,100,14,100,12,100,100,100,100,100,100,100,66],
[65,22,14,17,12,18,12,16,100,14,100,13,100,100,100,100,100,11,100,100,100,65],
[64,20,13,16,100,16,100,14,11,13,100,12,100,100,100,11,100,100,100,100,100,64],
[63,17,100,14,100,14,11,13,100,12,100,100,100,11,100,100,100,100,100,100,100,63],
[62,16,12,13,11,12,100,12,100,100,100,11,100,100,100,100,100,100,100,100,100,62],
[61,13,11,12,100,11,100,11,100,11,100,100,100,100,100,100,100,100,100,100,100,61],
[60,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,60],
[50,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,50],
[40,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,40],
[30,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,30],
[20,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,20],
[10,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,10],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

const deadliftScores = [[100,340,210,340,230,340,230,340,230,340,210,340,210,330,190,290,190,250,170,230,170,100],
[99,330,340,330,220,330,220,330,220,330,200,330,200,320,180,280,180,240,160,220,160,99],
[98,340,200,340,210,340,210,340,210,340,340,340,190,310,340,270,170,230,340,210,340,98],
[97,340,190,340,340,340,340,340,340,340,190,320,340,300,170,260,160,220,340,340,340,97],
[96,320,340,340,200,340,340,340,200,340,340,310,180,290,340,250,340,210,340,340,340,96],
[95,310,340,340,340,340,200,340,190,320,180,300,170,280,340,240,340,340,340,200,340,95],
[94,340,180,340,190,340,190,340,340,310,340,290,340,270,340,230,340,200,340,190,340,94],
[93,300,340,340,340,340,340,320,180,300,170,280,340,260,340,220,340,190,340,180,340,93],
[92,340,340,320,340,340,340,340,340,290,340,270,340,250,340,340,340,340,340,170,340,92],
[91,290,170,340,180,320,180,310,170,280,340,260,340,240,340,340,340,180,340,340,340,91],
[90,280,340,310,340,310,340,300,340,270,160,340,160,230,160,210,150,340,150,340,150,90],
[89,340,340,290,170,300,170,290,340,340,340,250,340,220,340,340,340,170,340,340,340,89],
[88,340,340,280,340,290,340,280,160,260,340,340,340,340,340,200,340,340,340,340,340,88],
[87,270,160,340,160,280,340,270,340,340,340,240,340,210,340,340,340,340,340,340,340,87],
[86,340,340,270,340,340,160,340,340,250,340,340,340,340,340,190,340,340,340,340,340,86],
[85,340,340,340,340,270,340,260,340,340,340,230,340,200,340,180,340,340,340,340,340,85],
[84,260,340,260,340,260,340,340,340,240,340,220,340,340,340,170,340,340,340,340,340,84],
[83,250,340,340,340,340,340,250,340,340,340,340,340,190,340,340,340,340,340,340,340,83],
[82,240,340,340,340,340,340,340,340,230,340,340,340,340,340,340,340,340,340,160,340,82],
[81,340,340,250,340,250,340,240,340,220,340,210,340,180,340,340,340,340,340,340,340,81],
[80,340,340,340,340,340,340,340,340,340,340,340,340,170,340,340,140,340,140,340,140,80],
[79,230,340,240,340,240,150,230,150,340,150,200,150,340,150,160,340,160,340,340,340,79],
[78,340,150,340,150,340,340,340,340,210,340,340,340,160,340,340,340,340,340,340,340,78],
[77,220,340,230,340,230,340,220,340,340,340,190,340,340,340,340,340,340,340,340,340,77],
[76,340,340,340,340,340,340,340,340,200,340,180,340,340,340,340,340,340,340,340,340,76],
[75,340,340,220,340,220,340,210,340,340,340,170,340,340,340,340,340,340,340,340,340,75],
[74,210,340,340,340,340,340,340,340,190,340,340,340,340,340,340,340,340,340,340,340,74],
[73,340,340,210,340,210,340,200,340,340,340,160,340,340,140,340,340,340,340,340,340,73],
[72,200,340,340,340,340,340,340,340,180,340,340,140,340,340,340,340,340,340,150,130,72],
[71,340,140,200,140,200,140,190,140,170,140,340,340,340,340,340,340,150,130,340,340,71],
[70,340,340,190,340,190,340,180,340,160,340,340,340,150,340,150,130,340,340,340,340,70],
[69,190,340,180,340,180,340,170,340,340,340,150,340,340,340,340,340,340,340,340,340,69],
[68,180,340,340,340,170,340,160,340,150,340,340,340,340,340,340,340,340,340,340,340,68],
[67,170,340,170,340,340,340,340,340,340,340,340,340,340,130,340,340,340,340,340,340,67],
[66,340,340,340,340,340,340,150,340,340,340,340,340,340,340,340,340,340,340,340,340,66],
[65,340,340,160,340,160,340,340,340,340,130,340,130,340,340,340,340,340,340,340,340,65],
[64,160,130,340,130,340,130,340,130,340,340,340,340,340,340,340,340,340,340,340,340,64],
[63,340,340,340,340,150,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,63],
[62,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,62],
[61,150,340,150,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,340,61],
[60,140,120,140,120,140,120,140,120,140,120,140,120,140,120,140,120,140,120,140,120,60],
[50,130,110,130,110,130,110,130,110,130,110,130,110,130,110,130,110,130,110,130,110,50],
[40,120,100,120,100,120,100,120,100,120,100,120,100,120,100,120,100,120,100,120,100,40],
[30,110,90,110,90,110,90,110,90,110,90,110,90,110,90,110,90,110,90,110,90,30],
[20,100,80,100,80,100,80,100,80,100,80,100,80,100,80,100,80,100,80,100,80,20],
[10,90,70,90,70,90,70,90,70,90,70,90,70,90,70,90,70,90,70,90,70,10],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

const ballThrowScores = [[100,12.6,8.4,13,8.5,13.1,8.7,12.9,8.6,12.8,8.2,12.3,8.1,11.6,7.8,10.6,7.4,9.9,6.6,9,6.6,100],
[99,12.4,8.2,12.9,8.4,12.9,8.5,12.6,8.4,12.6,8,12.1,7.9,11.4,7.6,10.4,7.1,9.7,6.4,8.8,6.4,99],
[98,12,7.7,12.5,7.9,12.6,8.2,12.4,8,12.2,7.5,11.7,7.4,11,7.1,10.2,6.6,9.5,6.3,100,6.3,98],
[97,11.7,7.5,12.2,7.7,12.4,8,12.2,7.8,12,7.3,11.4,7.2,10.7,6.8,10,6.5,9.4,6.2,8.7,6.2,97],
[96,11.5,7.3,12,7.5,12.2,7.7,12,7.6,11.8,7.2,11.3,7.1,10.6,6.5,9.8,6.3,9.3,6.1,100,6.1,96],
[95,11.3,7.2,11.8,7.4,12,7.5,11.8,7.4,11.6,7,11.1,6.9,10.4,6.4,9.6,6.2,9.1,6,8.6,6,95],
[94,11,7,11.5,7.2,11.7,7.3,11.6,7.3,11.4,6.8,10.8,6.8,10.2,6.2,9.5,6.1,9,5.9,8.5,5.9,94],
[93,10.9,6.9,11.4,7.1,11.6,7.2,11.4,7.1,11.2,6.7,10.7,6.7,10.1,100,9.3,6,8.9,5.8,8.3,5.8,93],
[92,10.7,6.8,11.3,7,11.4,7.1,11.3,7,11.1,100,10.6,6.6,10,100,9.2,5.9,8.8,5.7,8.2,5.7,92],
[91,10.6,6.6,11.1,6.9,11.3,7,11.2,6.9,10.9,6.6,10.5,6.5,9.9,6.1,9.1,5.8,8.7,5.6,8.1,5.6,91],
[90,10.5,6.5,11,6.8,11.1,6.9,11,6.8,10.7,6.4,10.4,6.4,9.7,6,9,5.7,8.5,5.5,8,5.5,90],
[89,10.4,6.5,10.7,6.7,11,6.8,10.8,6.7,10.6,100,10.3,6.3,9.6,5.9,8.9,5.6,100,5.4,100,100,89],
[88,10.3,6.4,10.6,6.6,10.9,6.7,10.7,6.5,10.5,6.3,10.1,6.2,9.5,100,8.8,100,8.4,100,7.9,5.4,88],
[87,10,6.3,10.4,6.5,10.7,6.6,10.5,6.4,10.4,6.2,9.9,6.1,9.4,5.8,8.7,5.5,8.3,5.3,100,100,87],
[86,9.9,6.2,10.3,6.4,10.6,6.5,10.4,100,10.3,6.1,9.8,6,9.3,5.7,8.6,100,8.2,100,7.8,5.3,86],
[85,9.8,6.1,10.2,6.3,10.5,100,10.3,6.3,10.2,100,9.7,100,9.2,5.6,100,5.4,8.1,100,100,100,85],
[84,9.7,6.1,10.1,6.2,10.4,6.4,10.2,100,10.1,6,9.6,5.9,9.1,100,8.5,100,100,5.2,7.7,100,84],
[83,9.6,6,10,6.1,10.2,6.3,10.1,6.2,9.9,5.9,9.5,5.8,9,5.5,8.4,5.3,8,100,7.6,5.2,83],
[82,9.5,6,9.9,9,10.1,100,10,6.1,9.8,5.8,9.4,100,8.9,100,8.3,5.2,7.9,100,100,100,82],
[81,9.4,5.9,9.8,6,10,6.2,9.9,6,9.7,100,9.3,100,8.8,5.4,8.2,100,7.8,100,7.5,100,81],
[80,9.3,5.8,9.7,5.9,9.8,6.1,9.8,5.9,9.6,5.7,9.2,5.7,8.7,5.3,8.1,100,7.7,5.1,100,5.1,80],
[79,9.2,5.8,9.6,5.8,100,5.9,9.7,100,9.5,100,9.1,5.6,100,100,100,5.1,7.6,100,7.4,100,79],
[78,9.1,5.7,9.5,9,9.7,100,9.6,5.8,9.4,5.6,9,100,8.6,5.2,8,100,7.5,100,100,100,78],
[77,9,5.7,9.4,9,9.6,5.8,9.5,100,9.3,100,8.9,5.5,8.5,100,7.9,5,100,5,7.3,5,77],
[76,8.9,5.6,9.3,5.7,9.4,5.7,9.4,5.7,9.2,5.5,8.8,5.4,8.4,100,7.8,100,7.4,100,7.2,100,76],
[75,8.8,5.5,9.2,5.6,9.3,100,9.3,100,9.1,5.4,8.7,100,8.3,5.1,100,4.9,7.3,4.9,100,4.9,75],
[74,8.6,5.4,9.1,5.5,100,5.6,9.2,5.6,9,100,100,5.3,8.2,100,7.7,100,7.2,100,7.1,100,74],
[73,8.5,5.4,9,9,9.2,100,9.1,5.5,8.9,5.3,8.6,100,100,5,7.6,4.8,7.1,100,7,4.8,73],
[72,8.4,5.3,8.9,5.4,9,5.5,8.9,100,8.8,5.2,8.4,5.2,8.1,100,7.5,4.7,7,4.8,6.8,4.7,72],
[71,8.3,5.2,8.8,5.3,8.9,5.4,8.8,5.4,8.7,100,8.3,100,8,4.9,7.4,100,100,4.6,6.7,4.6,71],
[70,8.2,5.2,8.6,9,8.8,5.3,8.7,5.3,8.6,100,8.2,5.1,7.9,100,7.3,4.6,6.9,100,6.6,100,70],
[69,8.1,5.1,8.5,5.2,8.6,100,8.6,100,8.5,5.1,8.1,5.1,7.7,4.8,7.1,100,6.8,4.5,6.4,4.5,69],
[68,8,5,8.3,9,8.5,5.2,8.5,5.2,8.3,5,8,5,7.6,4.7,7,4.5,6.7,4.4,6.2,4.4,68],
[67,7.9,5,8.2,5.1,8.4,100,8.3,100,8.2,4.9,7.9,4.9,7.5,4.6,100,4.4,6.6,4.3,100,4.3,67],
[66,7.7,4.9,8.1,5,8.3,5.1,8.2,5.1,8.1,100,7.8,4.8,7.4,100,6.9,100,6.5,4.2,6.1,4.2,66],
[65,7.5,4.8,7.8,4.9,8.1,5,8.1,5,7.8,4.8,7.6,4.7,7.2,100,6.7,4.3,6.3,4.1,100,4.1,65],
[64,7.4,4.8,7.7,4.8,7.9,4.9,7.9,4.9,7.7,4.7,7.4,100,7.1,4.5,6.6,4.2,6.2,4,5.9,100,64],
[63,7.2,4.7,7.5,4.7,7.7,4.8,7.6,4.8,7.5,4.6,7.3,4.6,6.9,4.4,6.4,100,6.1,3.9,5.7,4,63],
[62,6.9,4.6,7.3,4.6,7.5,4.7,7.4,4.7,7.3,4.5,7.1,4.5,6.7,4.2,6.2,4.1,6,3.8,5.4,3.9,62],
[61,6.6,4.4,6.9,4.4,7.1,4.6,7.1,4.5,7,4.4,6.7,4.2,6.4,4.1,6,3.9,5.7,3.6,5.1,3.6,61],
[60,6,3.9,6.3,4,6.5,4.2,6.5,4.1,6.4,4.1,6.2,3.9,6,3.7,5.7,3.5,5.3,3.4,4.9,3.4,60],
[59,6,3.9,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,59],
[58,6,3.9,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,58],
[57,5.9,3.9,6.2,9,6.4,4.1,6.4,9,6.3,9,6.1,9,5.9,9,5.6,9,9,9,9,9,57],
[56,5.9,3.9,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,56],
[55,5.9,3.9,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,55],
[54,5.9,3.8,11,3.9,9,9,9,4,9,4,9,3.8,9,3.6,9,3.4,5.2,9,4.8,9,54],
[53,5.9,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,53],
[52,5.8,3.8,6.1,3.9,6.3,4,6.3,9,6.2,9,6,9,5.8,9,5.5,9,9,9,9,9,52],
[51,5.8,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,51],
[50,5.8,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,50],
[49,5.8,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,49],
[48,5.8,3.8,11,3.9,6.2,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,48],
[47,5.7,3.8,11,3.9,9,9,6.2,9,6.1,9,9,3.7,5.7,9,5.4,9,5.1,9,9,9,47],
[46,5.7,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,46],
[45,5.7,3.8,11,3.9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,45],
[44,5.7,3.7,6,3.8,6.1,3.9,9,3.9,9,3.9,5.9,9,9,3.5,9,3.3,9,3.3,4.7,3.3,44],
[43,5.7,3.7,11,3.8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,43],
[42,5.6,3.7,11,3.8,9,9,6.1,9,6,9,9,3.6,5.6,9,5.3,9,5,9,9,9,42],
[41,5.6,3.7,11,3.8,6,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,41],
[40,5.6,3.7,11,3.8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,40],
[39,5.6,3.7,11,3.8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,39],
[38,5.5,3.7,5.9,3.8,9,9,9,9,9,9,5.8,9,9,9,5.2,9,9,9,9,9,38],
[37,5.5,3.6,11,3.8,5.9,9,6,9,5.9,3.8,9,9,5.5,9,9,3.2,9,9,4.6,9,37],
[36,5.5,3.6,5.8,3.8,9,9,9,9,9,9,5.7,9,9,9,9,9,9,9,9,9,36],
[35,5.5,3.6,11,3.7,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,35],
[34,5.4,3.6,11,3.7,9,3.8,9,3.8,9,9,9,3.5,9,3.4,5.1,9,9,3.2,9,3.2,34],
[33,5.4,3.6,5.7,3.7,9,9,9,9,9,9,5.6,9,9,9,9,9,9,9,9,9,33],
[32,5.4,3.5,11,3.7,5.8,9,5.9,9,5.8,3.7,9,9,5.4,9,9,3.1,9,9,4.5,9,32],
[31,5.3,3.5,5.6,3.7,9,9,9,9,9,9,5.5,9,9,9,5,9,9,9,9,9,31],
[30,5.3,3.5,11,3.7,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,30],
[29,5.3,3.5,11,3.7,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,29],
[28,5.2,3.5,5.5,3.7,5.7,9,5.8,9,5.7,9,5.4,9,5.3,3.3,9,9,9,9,9,9,28],
[27,5.2,3.5,11,3.6,9,3.7,9,3.7,9,9,9,3.4,9,9,9,9,9,9,9,9,27],
[26,5.2,3.5,5.4,3.6,5.6,9,5.7,9,5.6,9,5.3,9,5.2,9,9,9,9,9,9,9,26],
[25,5.2,3.5,11,3.6,5.6,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,25],
[24,5.1,3.4,11,3.6,5.6,9,5.6,9,9,3.6,9,9,9,3.2,4.9,3,4.9,3.1,4.4,3.1,24],
[23,5.1,3.4,5.3,9,5.5,9,9,9,5.5,9,5.2,9,5.1,9,9,9,9,9,9,9,23],
[22,5.1,3.4,11,3.5,9,3.6,5.5,3.6,9,9,9,3.3,9,9,9,9,9,9,9,9,22],
[21,5,3.4,5.2,9,5.4,9,9,9,5.4,9,5.1,9,5,3.1,9,9,9,9,9,9,21],
[20,5,3.4,11,9,9,9,5.4,9,9,9,9,9,9,9,9,9,9,9,9,9,20],
[19,5,3.4,11,9,5.3,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,19],
[18,4.9,3.3,5.1,3.4,9,3.5,5.3,3.5,5.3,3.5,5,3.2,4.9,3,4.8,9,4.8,3,9,3,18],
[17,4.9,3.3,11,9,5.2,9,9,9,9,9,9,9,9,9,9,2.9,9,9,4.3,9,17],
[16,4.8,3.3,5,9,9,9,5.2,9,5.2,9,9,9,4.8,9,4.7,9,4.7,9,9,9,16],
[15,4.8,3.3,11,9,5.1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,15],
[14,4.7,3.2,4.9,3.3,5,3.4,5.1,3.4,5.1,3.4,4.9,3.1,9,2.9,9,9,9,2.9,9,2.9,14],
[13,4.7,3.2,11,9,9,9,9,9,9,9,9,9,4.7,9,4.6,9,4.6,9,9,9,13],
[12,4.6,3.2,4.8,9,4.9,9,5,9,5,9,9,9,9,9,9,2.8,9,9,4.2,9,12],
[11,4.6,3.1,11,3.2,9,3.3,9,3.3,9,3.3,4.8,3,4.6,2.8,4.5,9,4.5,2.8,9,2.8,11],
[10,4.5,3.1,4.7,9,4.8,9,4.9,9,4.9,9,9,9,9,9,9,9,9,9,9,9,10],
[9,4.5,3.1,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
[8,4.4,3,4.6,3.1,4.7,3.2,4.8,3.2,4.8,3.2,4.7,2.9,4.5,2.7,4.4,2.7,4.4,2.7,4.1,2.7,8],
[7,4.4,3,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7],
[6,4.3,2.9,4.5,3,4.6,3.1,4.7,3.1,4.7,3.1,4.6,2.8,4.4,2.6,4.3,2.6,4.3,2.6,4,2.6,6],
[5,4.3,2.9,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5],
[4,4.2,2.8,4.4,2.9,4.5,3,4.6,3,4.6,3,4.5,2.7,4.3,2.5,4.2,2.5,4.2,2.5,3.9,2.5,4],
[3,4.2,2.8,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,3],
[2,4.1,2.7,4.3,2.8,4.4,2.9,4.5,2.9,4.5,2.9,4.4,2.6,4.2,2.4,4.1,2.4,4.1,2.4,3.8,2.4,2],
[1,4.1,2.7,11,11,11,11,11,11,11,11,11,11,11,11,11,11,9,9,9,9,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

const SDCScores = [[100,1.48334,1.9167,1.5,1.9167,1.5,1.9167,1.55,1.98334,1.6,2.03334,1.6667,2.15,1.75,2.18334,1.8667,2.3,1.9667,2.43334,2.15,2.43334,100],
[99,1.5167,1.98334,1.53334,1.93334,1.5167,1.95,1.5667,2.0167,1.6167,2.0667,1.7,2.1667,1.7667,2.2167,1.9167,2.35,2.03334,2.4667,2.2,2.4667,99],
[98,1.5667,2.03334,1.55,2,1.5667,2.0167,1.6167,2.08334,1.6667,2.1667,1.73334,2.25,1.83334,2.3667,1.95,2.4667,2.05,2.5667,2.2,2.5667,98],
[97,1.58334,2.08334,1.5667,2.03334,1.58334,2.0667,1.63334,2.13334,1.7,2.18334,1.7667,2.28334,1.8667,2.4,2,2.5,2.1,2.65,2.2167,2.65,97],
[96,1.6,2.1,1.6,2.08334,1.6167,2.1,1.6667,2.1667,1.7167,2.23334,1.8,2.3,1.9,2.43334,2.0167,2.53334,2.13334,2.68334,2.2167,2.68334,96],
[95,1.6167,2.13334,1.6167,2.1,1.63334,2.13334,1.68334,2.18334,1.75,2.25,1.8167,2.33334,1.9167,2.4667,2.05,2.58334,2.15,2.73334,2.23334,2.73334,95],
[94,1.65,2.1667,1.65,2.15,1.6667,2.1667,1.7167,2.23334,1.78334,2.3,1.85,2.38334,1.95,2.5,2.08334,2.63334,2.18334,2.75,2.25,2.75,94],
[93,1.6667,2.2,1.6667,2.1667,1.68334,2.2,1.73334,2.25,1.8,2.33334,1.8667,2.4167,1.98334,2.5167,2.1,2.6667,2.2167,2.7667,2.2667,2.7667,93],
[92,1.68334,2.2167,1.68334,2.2,1.7,2.2167,1.75,2.28334,1.8167,2.35,1.88334,2.45,2,2.55,2.1167,2.68334,2.25,2.8,2.2667,2.8,92],
[91,1.7,2.23334,1.7,2.2167,1.7167,2.25,1.7667,2.3,1.83334,2.38334,1.9,2.4667,2.0167,2.58334,2.15,2.7,2.2667,2.8667,2.2667,2.8667,91],
[90,1.7167,2.2667,1.7167,2.25,1.75,2.2667,1.8,2.33334,1.8667,2.4167,1.93334,2.5,2.03334,2.6167,2.1667,2.73334,2.28334,2.9,2.2667,2.9,90],
[89,1.73334,2.28334,1.73334,2.2667,1.7667,2.3,1.8167,2.35,1.88334,2.43334,1.95,2.5167,2.05,2.63334,2.18334,2.75,2.3167,2.9167,2.28334,2.9167,89],
[88,1.75,2.3,1.75,2.3,1.78334,2.3167,1.83334,2.38334,1.9,2.45,1.9667,2.55,2.08334,2.6667,2.2167,2.7667,2.33334,2.95,2.3,2.95,88],
[87,1.7667,2.33334,1.7667,2.33334,1.8,2.33334,1.85,2.4,1.9167,2.48334,1.98334,2.58334,2.1,2.68334,2.23334,2.8,2.35,2.9667,2.3167,2.9667,87],
[86,1.78334,2.35,1.78334,2.35,1.8167,2.3667,1.8667,2.43334,1.93334,2.5,2,2.6,2.1167,2.7,2.25,2.83334,2.3667,2.98334,2.33334,2.98334,86],
[85,1.8,2.3667,1.8,2.3667,1.83334,2.38334,1.88334,2.45,1.95,2.5167,2.0167,2.6167,2.13334,2.73334,2.2667,2.85,2.38334,3,2.35,3,85],
[84,1.8167,2.38334,1.8167,2.38334,1.85,2.4,1.9,2.4667,1.9667,2.53334,2.03334,2.63334,2.15,2.75,2.28334,2.8667,2.4,3.0167,2.3667,3.0167,84],
[83,1.83334,2.4,1.83334,2.4167,1.8667,2.43334,1.9167,2.5,1.98334,2.5667,2.0667,2.6667,2.1667,2.7667,2.3167,2.9,2.43334,3.03334,2.38334,3.03334,83],
[82,1.85,2.4167,1.85,2.43334,1.88334,2.45,1.93334,2.5167,2,2.58334,2.08334,2.68334,2.2,2.78334,2.33334,2.9167,2.45,3.05,2.4,3.05,82],
[81,1.8667,2.43334,1.8667,2.45,1.9,2.4667,1.95,2.53334,2.0167,2.6,2.1,2.7,2.2167,2.8,2.35,2.95,2.4667,3.0667,2.45,3.0667,81],
[80,1.88334,2.4667,1.88334,2.48334,1.9167,2.48334,1.9667,2.5667,2.03334,2.63334,2.1167,2.73334,2.23334,2.83334,2.38334,2.9667,2.48334,3.1167,2.53334,3.1167,80],
[79,1.9,2.48334,1.9,2.5,1.93334,2.5,1.98334,2.58334,2.05,2.65,2.13334,2.75,2.25,2.85,2.38334,2.98334,2.5,3.13334,2.55,3.13334,79],
[78,1.9167,2.5,1.9167,2.5167,1.95,2.5167,2,2.6,2.0667,2.6667,2.15,2.7667,2.2667,2.8667,2.4167,3,2.5167,3.15,2.58334,3.15,78],
[77,1.93334,2.5167,1.93334,2.53334,1.9667,2.53334,2.0167,2.6167,2.08334,2.7,2.1667,2.78334,2.28334,2.9,2.43334,3.03334,2.55,3.18334,2.6,3.18334,77],
[76,1.95,2.55,1.9667,2.5667,1.98334,2.5667,2.03334,2.65,2.1167,2.7167,2.2,2.8167,2.3167,2.93334,2.4667,3.08334,2.58334,3.28334,2.63334,3.28334,76],
[75,1.9667,2.5667,1.98334,2.58334,2,2.6,2.05,2.6667,2.13334,2.75,2.2167,2.83334,2.33334,2.95,2.48334,3.1167,2.6,3.35,2.68334,3.35,75],
[74,1.98334,2.58334,2,2.6167,2.0167,2.6167,2.0667,2.68334,2.15,2.7667,2.23334,2.8667,2.35,2.9667,2.5,3.15,2.6167,3.4167,2.7167,3.4167,74],
[73,2,2.6167,2.0167,2.63334,2.03334,2.63334,2.08334,2.7167,2.1667,2.78334,2.25,2.88334,2.38334,2.98334,2.5167,3.1667,2.63334,3.53334,2.73334,3.53334,73],
[72,2.0167,2.65,2.03334,2.6667,2.0667,2.6667,2.1167,2.75,2.2,2.8167,2.28334,2.9167,2.4167,3,2.53334,3.2167,2.6667,3.5667,2.7667,3.5667,72],
[71,2.03334,2.6667,2.05,2.7,2.08334,2.68334,2.13334,2.7667,2.2167,2.83334,2.3,2.93334,2.43334,3.03334,2.5667,3.2667,2.7,3.58334,2.78334,3.58334,71],
[70,2.05,2.68334,2.08334,2.7167,2.1,2.7167,2.1667,2.78334,2.23334,2.8667,2.33334,2.9667,2.45,3.08334,2.58334,3.3167,2.7167,3.6,2.8167,3.6,70],
[69,2.0667,2.73334,2.1167,2.75,2.13334,2.75,2.18334,2.83334,2.2667,2.9167,2.3667,3,2.48334,3.13334,2.6167,3.4167,2.75,3.6667,2.8667,3.6667,69],
[68,2.1,2.75,2.13334,2.78334,2.1667,2.78334,2.2167,2.85,2.3,2.93334,2.38334,3.0167,2.5,3.1667,2.63334,3.45,2.78334,3.68334,2.93334,3.68334,68],
[67,2.1167,2.78334,2.1667,2.8167,2.18334,2.8167,2.25,2.88334,2.33334,2.9667,2.4167,3.03334,2.53334,3.23334,2.6667,3.48334,2.8,3.7167,2.95,3.7167,67],
[66,2.13334,2.8167,2.18334,2.85,2.2167,2.85,2.2667,2.9167,2.35,3,2.43334,3.1,2.5667,3.2667,2.68334,3.55,2.83334,3.7667,3,3.7667,66],
[65,2.18334,2.88334,2.23334,2.9,2.25,2.9,2.3167,2.9667,2.4,3.03334,2.48334,3.1667,2.6167,3.35,2.73334,3.63334,2.88334,3.9,3.05,3.9,65],
[64,2.2167,2.9167,2.2667,2.95,2.28334,2.93334,2.35,3,2.43334,3.08334,2.5167,3.2,2.65,3.4,2.7667,3.7,2.9167,4,3.15,4,64],
[63,2.25,2.9667,2.3,2.98334,2.33334,2.98334,2.4,3.03334,2.4667,3.15,2.55,3.28334,2.68334,3.48334,2.8,3.75,2.95,4.13334,3.18334,4.13334,63],
[62,2.28334,3,2.35,3.0167,2.3667,3,2.43334,3.1,2.5167,3.2167,2.6,3.35,2.73334,3.53334,2.83334,3.83334,2.98334,4.2667,3.2,4.2667,62],
[61,2.3667,3.13334,2.43334,3.15,2.4667,3.1167,2.5167,3.25,2.6,3.35,2.68334,3.5167,2.8,3.7,2.95,3.9667,3.0667,4.35,3.23334,4.35,61],
[60,2.4667,3.25,2.5167,3.25,2.53334,3.25,2.6,3.3667,2.68334,3.45,2.75,3.7,2.88334,3.85,3,4.05,3.2,4.8,3.2667,4.8,60],
[59,2.48334,3.2667,2.53334,3.2667,2.55,3.2667,2.6167,3.38334,2.7,3.4667,2.7667,3.7167,2.9,3.8667,3.0167,4.0667,3.2167,4.8167,3.28334,4.8167,59],
[58,2.5,3.28334,2.55,3.28334,2.5667,3.28334,2.63334,3.4,2.7167,3.48334,2.78334,3.73334,2.9167,3.88334,3.03334,4.08334,3.23334,4.83334,3.3,4.83334,58],
[57,2.5167,3.3,2.5667,3.3,2.58334,3.3,2.65,3.4167,2.73334,3.5,2.8,3.75,2.93334,3.9,3.05,4.1,3.25,4.85,3.3167,4.85,57],
[56,2.53334,3.3167,2.58334,3.3167,2.6,3.3167,2.6667,3.43334,2.75,3.5167,2.8167,3.7667,2.95,3.9167,3.0667,4.1167,3.2667,4.8667,3.33334,4.8667,56],
[55,2.55,3.33334,2.6,3.33334,2.6167,3.33334,2.68334,3.45,2.7667,3.53334,2.83334,3.78334,2.9667,3.93334,3.08334,4.13334,3.28334,4.88334,3.35,4.88334,55],
[54,2.5667,3.35,2.6167,3.35,2.63334,3.35,2.7,3.4667,2.78334,3.55,2.85,3.8,2.98334,3.95,3.1,4.15,3.3,4.9,3.3667,4.9,54],
[53,2.58334,3.3667,2.63334,3.3667,2.65,3.3667,2.7167,3.48334,2.8,3.5667,2.8667,3.8167,3,3.9667,3.1167,4.1667,3.3167,4.9167,3.38334,4.9167,53],
[52,2.6,3.38334,2.65,3.38334,2.6667,3.38334,2.73334,3.5,2.8167,3.58334,2.88334,3.83334,3.0167,3.98334,3.13334,4.18334,3.33334,4.93334,3.4,4.93334,52],
[51,2.6167,3.4,2.6667,3.4,2.68334,3.4,2.75,3.5167,2.83334,3.6,2.9,3.85,3.03334,4,3.15,4.2,3.35,4.95,3.4167,4.95,51],
[50,2.63334,3.4167,2.68334,3.4167,2.7,3.4167,2.7667,3.53334,2.85,3.6167,2.9167,3.8667,3.05,4.0167,3.1667,4.2167,3.3667,4.9667,3.43334,4.9667,50],
[49,2.65,3.43334,2.7,3.43334,2.7167,3.43334,2.78334,3.55,2.8667,3.63334,2.93334,3.88334,3.0667,4.03334,3.18334,4.23334,3.38334,4.98334,3.45,4.98334,49],
[48,2.6667,3.45,2.7167,3.45,2.73334,3.45,2.8,3.5667,2.88334,3.65,2.95,3.9,3.08334,4.05,3.2,4.25,3.4,5,3.4667,5,48],
[47,2.68334,3.4667,2.73334,3.4667,2.75,3.4667,2.8167,3.58334,2.9,3.6667,2.9667,3.9167,3.1,4.0667,3.2167,4.2667,3.4167,5.0167,3.48334,5.0167,47],
[46,2.7,3.48334,2.75,3.48334,2.7667,3.48334,2.83334,3.6,2.9167,3.68334,2.98334,3.93334,3.1167,4.08334,3.23334,4.28334,3.43334,5.03334,3.5,5.03334,46],
[45,2.7167,3.5,2.7667,3.5,2.78334,3.5,2.85,3.6167,2.93334,3.7,3,3.95,3.13334,4.1,3.25,4.3,3.45,5.05,3.5167,5.05,45],
[44,2.73334,3.5167,2.78334,3.5167,2.8,3.5167,2.8667,3.63334,2.95,3.7167,3.0167,3.9667,3.15,4.1167,3.2667,4.3167,3.4667,5.0667,3.53334,5.0667,44],
[43,2.75,3.53334,2.8,3.53334,2.8167,3.53334,2.88334,3.65,2.9667,3.73334,3.03334,3.98334,3.1667,4.13334,3.28334,4.33334,3.48334,5.08334,3.55,5.08334,43],
[42,2.7667,3.55,2.8167,3.55,2.83334,3.55,2.9,3.6667,2.98334,3.75,3.05,4,3.18334,4.15,3.3,4.35,3.5,5.1,3.5667,5.1,42],
[41,2.78334,3.5667,2.83334,3.5667,2.85,3.5667,2.9167,3.68334,3,3.7667,3.0667,4.0167,3.2,4.1667,3.3167,4.3667,3.5167,5.1167,3.58334,5.1167,41],
[40,2.8,3.58334,2.85,3.58334,2.8667,3.58334,2.93334,3.7,3.0167,3.78334,3.08334,4.03334,3.2167,4.18334,3.33334,4.38334,3.53334,5.13334,3.6,5.13334,40],
[39,2.8167,3.6,2.8667,3.6,2.88334,3.6,2.95,3.7167,3.03334,3.8,3.1,4.05,3.23334,4.2,3.35,4.4,3.55,5.15,3.6167,5.15,39],
[38,2.83334,3.6167,2.88334,3.6167,2.9,3.6167,2.9667,3.73334,3.05,3.8167,3.1167,4.0667,3.25,4.2167,3.3667,4.4167,3.5667,5.1667,3.63334,5.1667,38],
[37,2.85,3.63334,2.9,3.63334,2.9167,3.63334,2.98334,3.75,3.0667,3.83334,3.13334,4.08334,3.2667,4.23334,3.38334,4.43334,3.58334,5.18334,3.65,5.18334,37],
[36,2.8667,3.65,2.9167,3.65,2.93334,3.65,3,3.7667,3.08334,3.85,3.15,4.1,3.28334,4.25,3.4,4.45,3.6,5.2,3.6667,5.2,36],
[35,2.88334,3.6667,2.93334,3.6667,2.95,3.6667,3.0167,3.78334,3.1,3.8667,3.1667,4.1167,3.3,4.2667,3.4167,4.4667,3.6167,5.2167,3.68334,5.2167,35],
[34,2.9,3.68334,2.95,3.68334,2.9667,3.68334,3.03334,3.8,3.1167,3.88334,3.18334,4.13334,3.3167,4.28334,3.43334,4.48334,3.63334,5.23334,3.7,5.23334,34],
[33,2.9167,3.7,2.9667,3.7,2.98334,3.7,3.05,3.8167,3.13334,3.9,3.2,4.15,3.33334,4.3,3.45,4.5,3.65,5.25,3.7167,5.25,33],
[32,2.93334,3.7167,2.98334,3.7167,3,3.7167,3.0667,3.83334,3.15,3.9167,3.2167,4.1667,3.35,4.3167,3.4667,4.5167,3.6667,5.2667,3.73334,5.2667,32],
[31,2.95,3.73334,3,3.73334,3.0167,3.73334,3.08334,3.85,3.1667,3.93334,3.23334,4.18334,3.3667,4.33334,3.48334,4.53334,3.68334,5.28334,3.75,5.28334,31],
[30,2.9667,3.75,3.0167,3.75,3.03334,3.75,3.1,3.8667,3.18334,3.95,3.25,4.2,3.38334,4.35,3.5,4.55,3.7,5.3,3.7667,5.3,30],
[29,2.98334,3.7667,3.03334,3.7667,3.05,3.7667,3.1167,3.88334,3.2,3.9667,3.2667,4.2167,3.4,4.3667,3.5167,4.5667,3.7167,5.3167,3.78334,5.3167,29],
[28,3,3.78334,3.05,3.78334,3.0667,3.78334,3.13334,3.9,3.2167,3.98334,3.28334,4.23334,3.4167,4.38334,3.53334,4.58334,3.73334,5.33334,3.8,5.33334,28],
[27,3.0167,3.8,3.0667,3.8,3.08334,3.8,3.15,3.9167,3.23334,4,3.3,4.25,3.43334,4.4,3.55,4.6,3.75,5.35,3.8167,5.35,27],
[26,3.03334,3.8167,3.08334,3.8167,3.1,3.8167,3.1667,3.93334,3.25,4.0167,3.3167,4.2667,3.45,4.4167,3.5667,4.6167,3.7667,5.3667,3.83334,5.3667,26],
[25,3.05,3.83334,3.1,3.83334,3.1167,3.83334,3.18334,3.95,3.2667,4.03334,3.33334,4.28334,3.4667,4.43334,3.58334,4.63334,3.78334,5.38334,3.85,5.38334,25],
[24,3.0667,3.85,3.1167,3.85,3.13334,3.85,3.2,3.9667,3.28334,4.05,3.35,4.3,3.48334,4.45,3.6,4.65,3.8,5.4,3.8667,5.4,24],
[23,3.08334,3.8667,3.13334,3.8667,3.15,3.8667,3.2167,3.98334,3.3,4.0667,3.3667,4.3167,3.5,4.4667,3.6167,4.6667,3.8167,5.4167,3.88334,5.4167,23],
[22,3.1,3.88334,3.15,3.88334,3.1667,3.88334,3.23334,4,3.3167,4.08334,3.38334,4.33334,3.5167,4.48334,3.63334,4.68334,3.83334,5.43334,3.9,5.43334,22],
[21,3.1167,3.9,3.1667,3.9,3.18334,3.9,3.25,4.0167,3.33334,4.1,3.4,4.35,3.53334,4.5,3.65,4.7,3.85,5.45,3.9167,5.45,21],
[20,3.13334,3.9167,3.18334,3.9167,3.2,3.9167,3.2667,4.03334,3.35,4.1167,3.4167,4.3667,3.55,4.5167,3.6667,4.7167,3.8667,5.4667,3.93334,5.4667,20],
[19,3.15,3.93334,3.2,3.93334,3.2167,3.93334,3.28334,4.05,3.3667,4.13334,3.43334,4.38334,3.5667,4.53334,3.68334,4.73334,3.88334,5.48334,3.95,5.48334,19],
[18,3.1667,3.95,3.2167,3.95,3.23334,3.95,3.3,4.0667,3.38334,4.15,3.45,4.4,3.58334,4.55,3.7,4.75,3.9,5.5,3.9667,5.5,18],
[17,3.18334,3.9667,3.23334,3.9667,3.25,3.9667,3.3167,4.08334,3.4,4.1667,3.4667,4.4167,3.6,4.5667,3.7167,4.7667,3.9167,5.5167,3.98334,5.5167,17],
[16,3.2,3.98334,3.25,3.98334,3.2667,3.98334,3.33334,4.1,3.4167,4.18334,3.48334,4.43334,3.6167,4.58334,3.73334,4.78334,3.93334,5.53334,4,5.53334,16],
[15,3.2167,4,3.2667,4,3.28334,4,3.35,4.1167,3.43334,4.2,3.5,4.45,3.63334,4.6,3.75,4.8,3.95,5.55,4.0167,5.55,15],
[14,3.23334,4.0167,3.28334,4.0167,3.3,4.0167,3.3667,4.13334,3.45,4.2167,3.5167,4.4667,3.65,4.6167,3.7667,4.8167,3.9667,5.5667,4.03334,5.5667,14],
[13,3.25,4.03334,3.3,4.03334,3.3167,4.03334,3.38334,4.15,3.4667,4.23334,3.53334,4.48334,3.6667,4.63334,3.78334,4.83334,3.98334,5.58334,4.05,5.58334,13],
[12,3.2667,4.05,3.3167,4.05,3.33334,4.05,3.4,4.1667,3.48334,4.25,3.55,4.5,3.68334,4.65,3.8,4.85,4,5.6,4.0667,5.6,12],
[11,3.28334,4.0667,3.33334,4.0667,3.35,4.0667,3.4167,4.18334,3.5,4.2667,3.5667,4.5167,3.7,4.6667,3.8167,4.8667,4.0167,5.6167,4.08334,5.6167,11],
[10,3.3,4.08334,3.35,4.08334,3.3667,4.08334,3.43334,4.2,3.5167,4.28334,3.58334,4.53334,3.7167,4.68334,3.83334,4.88334,4.03334,5.63334,4.1,5.63334,10],
[9,3.3167,4.1,3.3667,4.1,3.38334,4.1,3.45,4.2167,3.53334,4.3,3.6,4.55,3.73334,4.7,3.85,4.9,4.05,5.65,4.1167,5.65,9],
[8,3.33334,4.1167,3.38334,4.1167,3.4,4.1167,3.4667,4.23334,3.55,4.3167,3.6167,4.5667,3.75,4.7167,3.8667,4.9167,4.0667,5.6667,4.13334,5.6667,8],
[7,3.35,4.13334,3.4,4.13334,3.4167,4.13334,3.48334,4.25,3.5667,4.33334,3.63334,4.58334,3.7667,4.73334,3.88334,4.93334,4.08334,5.68334,4.15,5.68334,7],
[6,3.3667,4.15,3.4167,4.15,3.43334,4.15,3.5,4.2667,3.58334,4.35,3.65,4.6,3.78334,4.75,3.9,4.95,4.1,5.7,4.1667,5.7,6],
[5,3.38334,4.1667,3.43334,4.1667,3.45,4.1667,3.5167,4.28334,3.6,4.3667,3.6667,4.6167,3.8,4.7667,3.9167,4.9667,4.1167,5.7167,4.18334,5.7167,5],
[4,3.4,4.18334,3.45,4.18334,3.4667,4.18334,3.53334,4.3,3.6167,4.38334,3.68334,4.63334,3.8167,4.78334,3.93334,4.98334,4.13334,5.73334,4.2,5.73334,4],
[3,3.4167,4.2,3.4667,4.2,3.48334,4.2,3.55,4.3167,3.63334,4.4,3.7,4.65,3.83334,4.8,3.95,5,4.15,5.75,4.2167,5.75,3],
[2,3.43334,4.2167,3.48334,4.2167,3.5,4.2167,3.5667,4.33334,3.65,4.4167,3.7167,4.6667,3.85,4.8167,3.9667,5.0167,4.1667,5.7667,4.23334,5.7667,2],
[1,3.45,4.23334,3.5,4.23334,3.5167,4.23334,3.58334,4.35,3.6667,4.43334,3.73334,4.68334,3.8667,4.83334,3.98334,5.03334,4.18334,5.78334,4.25,5.78334,1],
[0,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,0]]

const plankScores = [[100,3.6666,3.6666,3.5833,3.5833,3.5,3.5,3.4166,3.4166,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,3.3333,100],
[99,3.6166,3.6166,3.5333,3.5333,3.45,3.45,3.3666,3.3666,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,3.2833,99],
[98,3.5666,3.5666,3.4833,3.4833,3.4,3.4,3.3166,3.3166,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,3.2333,98],
[97,3.5,3.5,3.4166,3.4166,3.3333,3.3333,3.25,3.25,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,3.1666,97],
[96,3.45,3.45,3.3666,3.3666,3.2833,3.2833,3.2,3.2,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,3.1166,96],
[95,3.4,3.4,3.3166,3.3166,3.2333,3.2333,3.15,3.15,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,3.0666,95],
[94,3.35,3.35,3.2666,3.2666,3.1833,3.1833,3.1,3.1,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,3.0166,94],
[93,3.2833,3.2833,3.2,3.2,3.1166,3.1166,3.0333,3.0333,2.95,2.95,2.95,2.95,2.95,2.95,2.95,2.95,2.95,2.95,2.95,2.95,93],
[92,3.2333,3.2333,3.15,3.15,3.0666,3.0666,2.9833,2.9833,2.9,2.9,2.9,2.9,2.9,2.9,2.9,2.9,2.9,2.9,2.9,2.9,92],
[91,3.1833,3.1833,3.1,3.1,3.0166,3.0166,2.9333,2.9333,2.85,2.85,2.85,2.85,2.85,2.85,2.85,2.85,2.85,2.85,2.85,2.85,91],
[90,3.1333,3.1333,3.05,3.05,2.9666,2.9666,2.8833,2.8833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,2.7833,90],
[89,3.0666,3.0666,2.9833,2.9833,2.9,2.9,2.8166,2.8166,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,2.7333,89],
[88,3.0166,3.0166,2.9333,2.9333,2.85,2.85,2.7666,2.7666,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,2.6833,88],
[87,2.9666,2.9666,2.8833,2.8833,2.8,2.8,2.7166,2.7166,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,2.6333,87],
[86,2.9166,2.9166,2.8333,2.8333,2.75,2.75,2.6666,2.6666,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,2.5833,86],
[85,2.85,2.85,2.7666,2.7666,2.6833,2.6833,2.6,2.6,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,2.5166,85],
[84,2.8,2.8,2.7166,2.7166,2.6333,2.6333,2.55,2.55,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,2.4666,84],
[83,2.75,2.75,2.6666,2.6666,2.5833,2.5833,2.5,2.5,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,2.4166,83],
[82,2.6833,2.6833,2.6166,2.6166,2.5166,2.5166,2.45,2.45,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,2.3666,82],
[81,2.6333,2.6333,2.55,2.55,2.4666,2.4666,2.3833,2.3833,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,2.3,81],
[80,2.5833,2.5833,2.5,2.5,2.4166,2.4166,2.3333,2.3333,2.25,2.25,2.25,2.25,2.25,2.25,2.25,2.25,2.25,2.25,2.25,2.25,80],
[79,2.5333,2.5333,2.45,2.45,2.3666,2.3666,2.2833,2.2833,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,79],
[78,2.4833,2.4833,2.3833,2.3833,2.3,2.3,2.2166,2.2166,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,2.1333,78],
[77,2.4166,2.4166,2.3333,2.3333,2.25,2.25,2.1666,2.1666,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,2.0833,77],
[76,2.3666,2.3666,2.2833,2.2833,2.2,2.2,2.1166,2.1166,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,2.0333,76],
[75,2.3166,2.3166,2.2333,2.2333,2.15,2.15,2.0666,2.0666,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,1.9833,75],
[74,2.25,2.25,2.1666,2.1666,2.1,2.1,2,2,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,1.9333,74],
[73,2.2,2.2,2.1166,2.1166,2.0333,2.0333,1.95,1.95,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,1.8666,73],
[72,2.15,2.15,2.0666,2.0666,1.9833,1.9833,1.9,1.9,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,1.8166,72],
[71,2.1,2.1,2.0166,2.0166,1.9333,1.9333,1.85,1.85,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,1.7666,71],
[70,2.0333,2.0333,1.9666,1.9666,1.8666,1.8666,1.7833,1.7833,1.7,1.7,1.7,1.7,1.7,1.7,1.7,1.7,1.7,1.7,1.7,1.7,70],
[69,1.9833,1.9833,1.9,1.9,1.8166,1.8166,1.7333,1.7333,1.65,1.65,1.65,1.65,1.65,1.65,1.65,1.65,1.65,1.65,1.65,1.65,69],
[68,1.9333,1.9333,1.85,1.85,1.7666,1.7666,1.6833,1.6833,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,68],
[67,1.8833,1.8833,1.8,1.8,1.7166,1.7166,1.6333,1.6333,1.55,1.55,1.55,1.55,1.55,1.55,1.55,1.55,1.55,1.55,1.55,1.55,67],
[66,1.8166,1.8166,1.75,1.75,1.65,1.65,1.5833,1.5833,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,66],
[65,1.7666,1.7666,1.6833,1.6833,1.6,1.6,1.5166,1.5166,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,1.4333,65],
[64,1.7166,1.7166,1.6333,1.6333,1.55,1.55,1.4666,1.4666,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,1.3833,64],
[63,1.6666,1.6666,1.5833,1.5833,1.5,1.5,1.4166,1.4166,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,1.3333,63],
[62,1.6166,1.6166,1.5333,1.5333,1.4333,1.4333,1.3666,1.3666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,1.2666,62],
[61,1.55,1.55,1.4666,1.4666,1.3833,1.3833,1.3,1.3,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,1.2166,61],
[60,1.5,1.5,1.4166,1.4166,1.3333,1.3333,1.25,1.25,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,1.1666,60],
[59,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,59],
[58,1.4833,1.4833,1.4,1.4,1.3166,1.3166,1.2333,1.2333,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15,1.15,58],
[57,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,57],
[56,1.4666,1.4666,1.3833,1.3833,1.3,1.3,1.2166,1.2166,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,1.1333,56],
[55,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,55],
[54,1.45,1.45,1.3666,1.3666,1.2833,1.2833,1.2,1.2,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,1.1166,54],
[53,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,53],
[52,1.4333,1.4333,1.35,1.35,1.2666,1.2666,1.1833,1.1833,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,1.1,52],
[51,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,51],
[50,1.4166,1.4166,1.3333,1.3333,1.25,1.25,1.1666,1.1666,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,1.0833,60],
[49,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,49],
[48,1.4,1.4,1.3166,1.3166,1.2333,1.2333,1.15,1.15,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,1.0666,48],
[47,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,47],
[46,1.3833,1.3833,1.3,1.3,1.2166,1.2166,1.1333,1.1333,1.05,1.05,1.05,1.05,1.05,1.05,1.05,1.05,1.05,1.05,1.05,1.05,46],
[45,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,45],
[44,1.3666,1.3666,1.2833,1.2833,1.2,1.2,1.1166,1.1166,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,1.0333,44],
[43,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,43],
[42,1.35,1.35,1.2666,1.2666,1.1833,1.1833,1.1,1.1,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,1.0166,42],
[41,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,41],
[40,1.3333,1.3333,1.25,1.25,1.1666,1.1666,1.0833,1.0833,1,1,1,1,1,1,1,1,1,1,1,1,40],
[39,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,39],
[38,1.3166,1.3166,1.2333,1.2333,1.15,1.15,1.0666,1.0666,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,0.9833,38],
[37,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,37],
[36,1.3,1.3,1.2166,1.2166,1.1333,1.1333,1.05,1.05,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,0.9666,36],
[35,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,35],
[34,1.2833,1.2833,1.2,1.2,1.1166,1.1166,1.0333,1.0333,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,0.95,34],
[33,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,33],
[32,1.2666,1.2666,1.1833,1.1833,1.1,1.1,1.0166,1.0166,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,0.9333,32],
[31,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,31],
[30,1.25,1.25,1.1666,1.1666,1.0833,1.0833,1,1,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,0.9166,30],
[29,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,29],
[28,1.2333,1.2333,1.15,1.15,1.0666,1.0666,0.9833,0.9833,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,28],
[27,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,27],
[26,1.2166,1.2166,1.1333,1.1333,1.05,1.05,0.9666,0.9666,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,0.8833,26],
[25,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,25],
[24,1.2,1.2,1.1166,1.1166,1.0333,1.0333,0.95,0.95,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,0.8666,24],
[23,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,23],
[22,1.1833,1.1833,1.1,1.1,1.0166,1.0166,0.9333,0.9333,0.85,0.85,0.85,0.85,0.85,0.85,0.85,0.85,0.85,0.85,0.85,0.85,22],
[21,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,21],
[20,1.1666,1.1666,1.0833,1.0833,1,1,0.9166,0.9166,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,0.8333,20],
[19,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,19],
[18,1.15,1.15,1.0666,1.0666,0.9833,0.9833,0.9,0.9,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,0.8166,18],
[17,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,17],
[16,1.1333,1.1333,1.05,1.05,0.9666,0.9666,0.8833,0.8833,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,0.8,16],
[15,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,15],
[14,1.1166,1.1166,1.0333,1.0333,0.95,0.95,0.8666,0.8666,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,0.7833,14],
[13,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,13],
[12,1.1,1.1,1.0166,1.0166,0.9333,0.9333,0.85,0.85,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,0.7666,12],
[11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,11],
[10,1.0833,1.0833,1,1,0.9166,0.9166,0.8333,0.8333,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,10],
[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
[8,1.0666,1.0666,0.9833,0.9833,0.9,0.9,0.8166,0.8166,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,0.7333,8],
[7,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7],
[6,1.05,1.05,0.9666,0.9666,0.8833,0.8833,0.8,0.8,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,0.7166,6],
[5,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5],
[4,1.0333,1.0333,0.95,0.95,0.8666,0.8666,0.7833,0.7833,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,4],
[3,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,3],
[2,1.0166,1.0166,0.9333,0.9333,0.85,0.85,0.7666,0.7666,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,0.6833,2],
[1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

const runScores = [[100,13.3667,15.4834,13.45,15,13.5167,15,13.7,15.3,13.9667,15.5,14.0834,15.8167,14.5,15.9667,15.15,16.4834,15.4667,17.3,15.4667,17.3,100],
[99,13.7,15.9167,13.8334,15.5,13.9667,15.5,14.1,15.7667,14.3334,15.9334,14.4834,16.2,14.9,16.2334,15.5667,17.0167,15.9167,17.7834,15.9167,17.7834,99],
[98,14,16.2667,14.1334,15.85,14.25,15.8834,14.4167,16.1167,14.6167,16.3,14.8,16.5834,15.2334,16.6,15.9167,17.3667,16.3667,17.9334,16.3667,17.9334,98],
[97,14.25,16.5667,14.4167,16.15,14.5167,16.1667,14.6667,16.4667,14.8834,16.6,15.0667,16.8334,15.5334,16.9334,16.2334,17.6334,16.7334,18,16.7334,18,97],
[96,14.4667,16.8,14.6334,16.4334,14.75,16.4334,14.9,16.7167,15.1,16.85,15.3334,17.1167,15.8,17.25,16.4667,17.8334,16.9667,18.4167,16.9667,18.4167,96],
[95,14.6667,17.0167,14.8334,16.65,14.95,16.6667,15.1,16.95,15.3167,17.0667,15.55,17.4,16.0334,17.4667,16.7,18,17.2334,18.5167,17.2334,18.5167,95],
[94,14.85,17.2334,15.0167,16.8667,15.1167,16.9,15.3,17.1334,15.5,17.3,15.75,17.5834,16.25,17.65,16.9167,18.2167,17.45,18.6,17.45,18.6,94],
[93,15,17.45,15.2167,17.0667,15.3167,17.0834,15.5,17.3334,15.6834,17.5,15.9334,17.7834,16.45,17.8834,17.1,18.3334,17.75,18.7667,17.75,18.7667,93],
[92,15.1834,17.6167,15.3834,17.2667,15.5,17.2834,15.65,17.5,15.85,17.6834,16.1,17.9334,16.6,18,17.2667,18.5,17.95,18.8,17.95,18.8,92],
[91,15.3334,17.7834,15.5334,17.4667,15.65,17.45,15.8167,17.6834,16,17.8667,16.3,18.1,16.7667,18.2,17.4334,18.6667,18.1167,18.9334,18.1167,18.9334,91],
[90,15.5,17.9334,15.7167,17.6167,15.8,17.5834,15.9667,17.8334,16.1667,18,16.4667,18.2667,16.95,18.4,17.6,18.8834,18.2834,18.9834,18.2834,18.9834,90],
[89,15.65,18.0667,15.8834,17.7834,15.9667,17.7667,16.1167,18,16.3334,18.1667,16.6334,18.4334,17.1167,18.5667,17.8,19.0334,18.4167,19.0667,18.4167,19.0667,89],
[88,15.8,18.2167,16.0167,17.95,16.0834,17.9167,16.2667,18.15,16.5,18.3334,16.7834,18.5834,17.2667,18.7334,17.95,19.2334,18.6,19.2334,18.6,19.2334,88],
[87,15.95,18.3667,16.1667,18.0667,16.25,18.0334,16.4167,18.3,16.6334,18.5,16.9167,18.7334,17.4334,18.9167,18.0667,19.4834,18.75,19.4834,18.75,19.4834,87],
[86,16.0834,18.5,16.3334,18.2167,16.4,18.2,16.5334,18.45,16.7667,18.6,17.0667,18.8834,17.5667,19.0667,18.25,19.6,18.8834,19.6834,18.8834,19.6834,86],
[85,16.2334,18.65,16.4834,18.3834,16.5334,18.35,16.6834,18.6,16.9167,18.75,17.2,19.0167,17.7167,19.2167,18.4,19.75,19,19.75,19,19.75,85],
[84,16.3667,18.7667,16.6167,18.5,16.6834,18.5,16.8167,18.75,17.05,18.8667,17.35,19.1667,17.85,19.3667,18.5334,19.9667,19.1167,19.9667,19.1167,19.9667,84],
[83,16.5,18.9,16.7667,18.65,16.8167,18.6167,16.9667,18.8667,17.2167,19,17.5,19.3167,18,19.5,18.6667,20.0334,19.2834,20.0334,19.2834,20.0334,83],
[82,16.65,19,16.9167,18.8,16.9667,18.7667,17.0834,19,17.35,19.0834,17.6334,19.45,18.1,19.6667,18.8167,20.1167,19.45,20.1167,19.45,20.1167,82],
[81,16.8,19.15,17.0667,18.9334,17.0834,18.9,17.25,19.1167,17.5,19.2334,17.7834,19.6,18.2667,19.75,18.9334,20.2834,19.6,20.2834,19.6,20.2834,81],
[80,16.95,19.2834,17.2167,19.05,17.2334,19,17.3834,19.25,17.6334,19.3667,17.9167,19.75,18.4334,19.8667,19.05,20.3667,19.75,20.3667,19.75,20.3667,80],
[79,17.0834,19.4,17.3667,19.2,17.3834,19.1334,17.5167,19.3834,17.75,19.5,18,19.85,18.55,19.9834,19.2167,20.5167,19.85,20.5167,19.85,20.5167,79],
[78,17.25,19.5334,17.5,19.35,17.5167,19.2667,17.6667,19.5167,17.9,19.6167,18.1667,19.9667,18.7,20.1,19.35,20.6334,19.9834,20.6334,19.9834,20.6334,78],
[77,17.4,19.6667,17.6667,19.5,17.6834,19.4167,17.8,19.6667,18,19.8,18.3334,20.0334,18.85,20.2334,19.5,20.7167,20.1167,20.7167,20.1167,20.7167,77],
[76,17.55,19.8,17.8167,19.65,17.8334,19.55,17.9334,19.7834,18.1667,19.9334,18.4834,20.2,19,20.3334,19.6,20.7334,20.2334,20.7334,20.2334,20.7334,76],
[75,17.7167,19.9334,17.9834,19.7834,17.9667,19.7,18.05,19.9167,18.3,20.0334,18.6167,20.35,19.1167,20.4834,19.75,20.7334,20.3667,20.7334,20.3667,20.7334,75],
[74,17.8667,20.05,18.1167,19.9334,18.0834,19.8334,18.2,20.0167,18.4667,20.2,18.7667,20.5334,19.2834,20.6,19.8834,20.8334,20.5167,20.8334,20.5167,20.8334,74],
[73,18.0167,20.2,18.2834,20.0667,18.25,19.9834,18.3834,20.1667,18.6167,20.3334,18.9334,20.6334,19.45,20.7167,20,21.05,20.6834,21.05,20.6834,21.05,73],
[72,18.2,20.35,18.4667,20.2334,18.4167,20.1167,18.55,20.3,18.7834,20.5,19.0667,20.7834,19.6,20.7334,20.1334,21.25,20.7667,21.25,20.7667,21.25,72],
[71,18.3834,20.5,18.6334,20.3834,18.5834,20.2667,18.7167,20.45,18.95,20.6334,19.2667,20.95,19.7834,20.8667,20.3,21.5334,20.9,21.5334,20.9,21.5334,71],
[70,18.5834,20.6667,18.8334,20.5334,18.7667,20.4167,18.8834,20.5834,19.1,20.7667,19.4334,21,19.95,21.15,20.45,21.6667,21,21.6667,21,21.6667,70],
[69,18.7834,20.8167,19,20.7167,18.9667,20.6,19.05,20.7334,19.3167,20.9167,19.6334,21.1334,20.1,21.4,20.65,21.7167,21.0167,21.7167,21.0167,21.7167,69],
[68,19,20.9667,19.2167,20.8834,19.15,20.75,19.2667,20.9,19.5,21,19.8334,21.3334,20.2834,21.6,20.8167,21.9834,21.3167,21.9834,21.3167,22.0334,68],
[67,19.2,21.05,19.4334,21,19.3667,20.9334,19.4667,21,19.7,21.0667,20,21.5834,20.4667,21.8167,20.9834,22.15,21.5834,22.15,21.5834,22.25,67],
[66,19.45,21.3334,19.6667,21.1,19.6,21,19.6834,21.0834,19.9167,21.3334,20.1667,21.85,20.6667,22.0167,21,22.3834,21.7834,22.3834,21.7834,22.5167,66],
[65,19.7167,21.6167,19.9334,21.4,19.85,21.25,19.9334,21.45,20.1167,21.6,20.4167,22.0834,20.8834,22.2167,21.2667,22.55,22.05,22.55,22.05,22.7334,65],
[64,20,21.9,20.2,21.7334,20.1,21.5667,20.1834,21.8,20.3667,21.9334,20.6667,22.3334,21,22.4667,21.65,22.7167,22.35,22.7167,22.35,22.8334,64],
[63,20.3167,22.1834,20.5,22.05,20.4167,21.9334,20.4834,22.1,20.6834,22.1834,20.9667,22.6,21.2167,22.5834,22,22.8667,22.65,23.0167,22.65,23.0667,63],
[62,20.7,22.5834,20.8667,22.4,20.7667,22.3,20.8167,22.5,21,22.5667,21,22.8834,21.7167,22.8334,22.4,23.0667,22.9667,23.3667,22.9667,23.3667,62],
[61,21.05,22.9667,21.2334,22.8334,21,22.7667,21.0167,22.9167,21.2834,23,21.7334,23.1667,22.2834,23.4167,22.8834,23.7334,23.2,24.0834,23.2,24.1834,61],
[60,22,23.3667,22,23.25,22,23.2167,22,23.3167,22.1834,23.3834,22.5334,23.7,22.9167,24,23.3334,24.4,23.6,24.8,23.6,25,60],
[59,22.0167,23.3834,22.0167,23.2667,22.0167,23.2334,22.0167,23.3334,22.2,23.4,22.55,23.7167,22.9334,24.0167,23.35,24.4167,23.6167,24.8167,23.6167,25.0167,59],
[58,22.05,23.4167,22.05,23.3,22.05,23.2667,22.05,23.3667,22.2334,23.4334,22.5834,23.75,22.9667,24.05,23.3834,24.45,23.65,24.85,23.65,25.05,58],
[57,22.0834,23.45,22.0834,23.3334,22.0834,23.3,22.0834,23.4,22.2667,23.4667,22.6167,23.7834,23,24.0834,23.4167,24.4834,23.6834,24.8834,23.6834,25.0834,57],
[56,22.1167,23.4834,22.1167,23.3667,22.1167,23.3334,22.1167,23.4334,22.3,23.5,22.65,23.8167,23.0334,24.1167,23.45,24.5167,23.7167,24.9167,23.7167,25.1167,56],
[55,22.15,23.5167,22.15,23.4,22.15,23.3667,22.15,23.4667,22.3334,23.5334,22.6834,23.85,23.0667,24.15,23.4834,24.55,23.75,24.95,23.75,25.15,55],
[54,22.1834,23.55,22.1834,23.4334,22.1834,23.4,22.1834,23.5,22.3667,23.5667,22.7167,23.8834,23.1,24.1834,23.5167,24.5834,23.7834,24.9834,23.7834,25.1834,54],
[53,22.2167,23.5834,22.2167,23.4667,22.2167,23.4334,22.2167,23.5334,22.4,23.6,22.75,23.9167,23.1334,24.2167,23.55,24.6167,23.8167,25.0167,23.8167,25.2167,53],
[52,22.25,23.6167,22.25,23.5,22.25,23.4667,22.25,23.5667,22.4334,23.6334,22.7834,23.95,23.1667,24.25,23.5834,24.65,23.85,25.05,23.85,25.25,52],
[51,22.2834,23.65,22.2834,23.5334,22.2834,23.5,22.2834,23.6,22.4667,23.6667,22.8167,23.9834,23.2,24.2834,23.6167,24.6834,23.8834,25.0834,23.8834,25.2834,51],
[50,22.3167,23.6834,22.3167,23.5667,22.3167,23.5334,22.3167,23.6334,22.5,23.7,22.85,24.0167,23.2334,24.3167,23.65,24.7167,23.9167,25.1167,23.9167,25.3167,50],
[49,22.35,23.7167,22.35,23.6,22.35,23.5667,22.35,23.6667,22.5334,23.7334,22.8834,24.05,23.2667,24.35,23.6834,24.75,23.95,25.15,23.95,25.35,49],
[48,22.3834,23.75,22.3834,23.6334,22.3834,23.6,22.3834,23.7,22.5667,23.7667,22.9167,24.0834,23.3,24.3834,23.7167,24.7834,23.9834,25.1834,23.9834,25.3834,48],
[47,22.4167,23.7834,22.4167,23.6667,22.4167,23.6334,22.4167,23.7334,22.6,23.8,22.95,24.1167,23.3334,24.4167,23.75,24.8167,24.0167,25.2167,24.0167,25.4167,47],
[46,22.45,23.8167,22.45,23.7,22.45,23.6667,22.45,23.7667,22.6334,23.8334,22.9834,24.15,23.3667,24.45,23.7834,24.85,24.05,25.25,24.05,25.45,46],
[45,22.4834,23.85,22.4834,23.7334,22.4834,23.7,22.4834,23.8,22.6667,23.8667,23.0167,24.1834,23.4,24.4834,23.8167,24.8834,24.0834,25.2834,24.0834,25.4834,45],
[44,22.5167,23.8834,22.5167,23.7667,22.5167,23.7334,22.5167,23.8334,22.7,23.9,23.05,24.2167,23.4334,24.5167,23.85,24.9167,24.1167,25.3167,24.1167,25.5167,44],
[43,22.55,23.9167,22.55,23.8,22.55,23.7667,22.55,23.8667,22.7334,23.9334,23.0834,24.25,23.4667,24.55,23.8834,24.95,24.15,25.35,24.15,25.55,43],
[42,22.5834,23.95,22.5834,23.8334,22.5834,23.8,22.5834,23.9,22.7667,23.9667,23.1167,24.2834,23.5,24.5834,23.9167,24.9834,24.1834,25.3834,24.1834,25.5834,42],
[41,22.6167,23.9834,22.6167,23.8667,22.6167,23.8334,22.6167,23.9334,22.8,24,23.15,24.3167,23.5334,24.6167,23.95,25.0167,24.2167,25.4167,24.2167,25.6167,41],
[40,22.65,24.0167,22.65,23.9,22.65,23.8667,22.65,23.9667,22.8334,24.0334,23.1834,24.35,23.5667,24.65,23.9834,25.05,24.25,25.45,24.25,25.65,40],
[39,22.6834,24.05,22.6834,23.9334,22.6834,23.9,22.6834,24,22.8667,24.0667,23.2167,24.3834,23.6,24.6834,24.0167,25.0834,24.2834,25.4834,24.2834,25.6834,39],
[38,22.7167,24.0834,22.7167,23.9667,22.7167,23.9334,22.7167,24.0334,22.9,24.1,23.25,24.4167,23.6334,24.7167,24.05,25.1167,24.3167,25.5167,24.3167,25.7167,38],
[37,22.75,24.1167,22.75,24,22.75,23.9667,22.75,24.0667,22.9334,24.1334,23.2834,24.45,23.6667,24.75,24.0834,25.15,24.35,25.55,24.35,25.75,37],
[36,22.7834,24.15,22.7834,24.0334,22.7834,24,22.7834,24.1,22.9667,24.1667,23.3167,24.4834,23.7,24.7834,24.1167,25.1834,24.3834,25.5834,24.3834,25.7834,36],
[35,22.8167,24.1834,22.8167,24.0667,22.8167,24.0334,22.8167,24.1334,23,24.2,23.35,24.5167,23.7334,24.8167,24.15,25.2167,24.4167,25.6167,24.4167,25.8167,35],
[34,22.85,24.2167,22.85,24.1,22.85,24.0667,22.85,24.1667,23.0334,24.2334,23.3834,24.55,23.7667,24.85,24.1834,25.25,24.45,25.65,24.45,25.85,34],
[33,22.8834,24.25,22.8834,24.1334,22.8834,24.1,22.8834,24.2,23.0667,24.2667,23.4167,24.5834,23.8,24.8834,24.2167,25.2834,24.4834,25.6834,24.4834,25.8834,33],
[32,22.9167,24.2834,22.9167,24.1667,22.9167,24.1334,22.9167,24.2334,23.1,24.3,23.45,24.6167,23.8334,24.9167,24.25,25.3167,24.5167,25.7167,24.5167,25.9167,32],
[31,22.95,24.3167,22.95,24.2,22.95,24.1667,22.95,24.2667,23.1334,24.3334,23.4834,24.65,23.8667,24.95,24.2834,25.35,24.55,25.75,24.55,25.95,31],
[30,22.9834,24.35,22.9834,24.2334,22.9834,24.2,22.9834,24.3,23.1667,24.3667,23.5167,24.6834,23.9,24.9834,24.3167,25.3834,24.5834,25.7834,24.5834,25.9834,30],
[29,23.0334,24.4,23.0334,24.2834,23.0334,24.25,23.0334,24.35,23.2167,24.4167,23.5667,24.7334,23.95,25.0334,24.3667,25.4334,24.6334,25.8334,24.6334,26.0334,29],
[28,23.0667,24.4334,23.0667,24.3167,23.0667,24.2834,23.0667,24.3834,23.25,24.45,23.6,24.7667,23.9834,25.0667,24.4,25.4667,24.6667,25.8667,24.6667,26.0667,28],
[27,23.1,24.4667,23.1,24.35,23.1,24.3167,23.1,24.4167,23.2834,24.4834,23.6334,24.8,24.0167,25.1,24.4334,25.5,24.7,25.9,24.7,26.1,27],
[26,23.1334,24.5,23.1334,24.3834,23.1334,24.35,23.1334,24.45,23.3167,24.5167,23.6667,24.8334,24.05,25.1334,24.4667,25.5334,24.7334,25.9334,24.7334,26.1334,26],
[25,23.1667,24.5334,23.1667,24.4167,23.1667,24.3834,23.1667,24.4834,23.35,24.55,23.7,24.8667,24.0834,25.1667,24.5,25.5667,24.7667,25.9667,24.7667,26.1667,25],
[24,23.2,24.5667,23.2,24.45,23.2,24.4167,23.2,24.5167,23.3834,24.5834,23.7334,24.9,24.1167,25.2,24.5334,25.6,24.8,26,24.8,26.2,24],
[23,23.2334,24.6,23.2334,24.4834,23.2334,24.45,23.2334,24.55,23.4167,24.6167,23.7667,24.9334,24.15,25.2334,24.5667,25.6334,24.8334,26.0334,24.8334,26.2334,23],
[22,23.2667,24.6334,23.2667,24.5167,23.2667,24.4834,23.2667,24.5834,23.45,24.65,23.8,24.9667,24.1834,25.2667,24.6,25.6667,24.8667,26.0667,24.8667,26.2667,22],
[21,23.3,24.6667,23.3,24.55,23.3,24.5167,23.3,24.6167,23.4834,24.6834,23.8334,25,24.2167,25.3,24.6334,25.7,24.9,26.1,24.9,26.3,21],
[20,23.3334,24.7,23.3334,24.5834,23.3334,24.55,23.3334,24.65,23.5167,24.7167,23.8667,25.0334,24.25,25.3334,24.6667,25.7334,24.9334,26.1334,24.9334,26.3334,20],
[19,23.3667,24.7334,23.3667,24.6167,23.3667,24.5834,23.3667,24.6834,23.55,24.75,23.9,25.0667,24.2834,25.3667,24.7,25.7667,24.9667,26.1667,24.9667,26.3667,19],
[18,23.4,24.7667,23.4,24.65,23.4,24.6167,23.4,24.7167,23.5834,24.7834,23.9334,25.1,24.3167,25.4,24.7334,25.8,25,26.2,25,26.4,18],
[17,23.4334,24.8,23.4334,24.6834,23.4334,24.65,23.4334,24.75,23.6167,24.8167,23.9667,25.1334,24.35,25.4334,24.7667,25.8334,25.0334,26.2334,25.0334,26.4334,17],
[16,23.4667,24.8334,23.4667,24.7167,23.4667,24.6834,23.4667,24.7834,23.65,24.85,24,25.1667,24.3834,25.4667,24.8,25.8667,25.0667,26.2667,25.0667,26.4667,16],
[15,23.5,24.8667,23.5,24.75,23.5,24.7167,23.5,24.8167,23.6834,24.8834,24.0334,25.2,24.4167,25.5,24.8334,25.9,25.1,26.3,25.1,26.5,15],
[14,23.5334,24.9,23.5334,24.7834,23.5334,24.75,23.5334,24.85,23.7167,24.9167,24.0667,25.2334,24.45,25.5334,24.8667,25.9334,25.1334,26.3334,25.1334,26.5334,14],
[13,23.5667,24.9334,23.5667,24.8167,23.5667,24.7834,23.5667,24.8834,23.75,24.95,24.1,25.2667,24.4834,25.5667,24.9,25.9667,25.1667,26.3667,25.1667,26.5667,13],
[12,23.6,24.9667,23.6,24.85,23.6,24.8167,23.6,24.9167,23.7834,24.9834,24.1334,25.3,24.5167,25.6,24.9334,26,25.2,26.4,25.2,26.6,12],
[11,23.6334,25,23.6334,24.8834,23.6334,24.85,23.6334,24.95,23.8167,25.0167,24.1667,25.3334,24.55,25.6334,24.9667,26.0334,25.2334,26.4334,25.2334,26.6334,11],
[10,23.6667,25.0334,23.6667,24.9167,23.6667,24.8834,23.6667,24.9834,23.85,25.05,24.2,25.3667,24.5834,25.6667,25,26.0667,25.2667,26.4667,25.2667,26.6667,10],
[9,23.7,25.0667,23.7,24.95,23.7,24.9167,23.7,25.0167,23.8834,25.0834,24.2334,25.4,24.6167,25.7,25.0334,26.1,25.3,26.5,25.3,26.7,9],
[8,23.7334,25.1,23.7334,24.9834,23.7334,24.95,23.7334,25.05,23.9167,25.1167,24.2667,25.4334,24.65,25.7334,25.0667,26.1334,25.3334,26.5334,25.3334,26.7334,8],
[7,23.7667,25.1334,23.7667,25.0167,23.7667,24.9834,23.7667,25.0834,23.95,25.15,24.3,25.4667,24.6834,25.7667,25.1,26.1667,25.3667,26.5667,25.3667,26.7667,7],
[6,23.8,25.1667,23.8,25.05,23.8,25.0167,23.8,25.1167,23.9834,25.1834,24.3334,25.5,24.7167,25.8,25.1334,26.2,25.4,26.6,25.4,26.8,6],
[5,23.8334,25.2,23.8334,25.0834,23.8334,25.05,23.8334,25.15,24.0167,25.2167,24.3667,25.5334,24.75,25.8334,25.1667,26.2334,25.4334,26.6334,25.4334,26.8334,5],
[4,23.8667,25.2334,23.8667,25.1167,23.8667,25.0834,23.8667,25.1834,24.05,25.25,24.4,25.5667,24.7834,25.8667,25.2,26.2667,25.4667,26.6667,25.4667,26.8667,4],
[3,23.9,25.2667,23.9,25.15,23.9,25.1167,23.9,25.2167,24.0834,25.2834,24.4334,25.6,24.8167,25.9,25.2334,26.3,25.5,26.7,25.5,26.9,3],
[2,23.9334,25.3,23.9334,25.1834,23.9334,25.15,23.9334,25.25,24.1167,25.3167,24.4667,25.6334,24.85,25.9334,25.2667,26.3334,25.5334,26.7334,25.5334,26.9334,2],
[1,23.9667,25.3334,23.9667,25.2167,23.9667,25.1834,23.9667,25.2834,24.15,25.35,24.5,25.6667,24.8834,25.9667,25.3,26.3667,25.5667,26.7667,25.5667,26.9667,1],
[0,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,0]]

function calculateDeadliftScore(input) {
  const score = calculateIndividualEventScore100(input, true, deadliftScores)
  return score
}
function calculatePushupScore(input) {
  const score = calculateIndividualEventScore100(input, true, pushupScores)
  return score
}

function calculateSDCScore(input) {
  const score = calculateIndividualEventScore100(input, false, SDCScores)
  return score
}

function calculateBallThrowScore(input) {
  const score = calculateIndividualEventScore100(input, true, ballThrowScores)
  return score
}

function calculatePlankScore(input) {
  const score = calculateIndividualEventScore100(input, true, plankScores)
  return score
}

function calculateRunScore(input) {
  const score = calculateIndividualEventScore100(input, false, runScores)
  return score
}

function calculateIndividualEventScore100(input, above, scoresArray) {
  if (above) {
    if (gender === 'm' || gender === "M"){
      if (age < 22 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][1]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 27 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][3]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 32 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][5]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 37 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][7]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 42 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][9]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 47 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][11]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 52 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][13]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 57 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][15]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 62 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][17]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age >= 62) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][19]) {
            return scoresArray[i][0]
          }
        }
      }
      else {
        return 0
      }
    }
    else if (gender === 'f' || gender === 'F') {
      if (age < 22 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][2]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 27 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][4]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 32 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][6]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 37 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][8]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 42 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][10]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 47 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][12]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 52 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][14]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 57 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][16]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 62 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][18]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age >= 62) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input >= scoresArray[i][20]) {
            return scoresArray[i][0]
          }
        }
      }
      else {
        return 0
      }
    }
    else {
      return 0
    }
  }
  else {
    if (gender === 'm' || gender === 'M'){
      if (age < 22 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][1]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 27 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][3]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 32 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][5]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 37 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][7]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 42 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][9]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 47 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][11]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 52 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][13]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 57 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][15]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 62 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][17]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age >= 62) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][19]) {
            return scoresArray[i][0]
          }
        }
      }
      else {
        return 0
      }
    }
    else if (gender === 'f' || gender === 'F') {
      if (age < 22 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][2]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 27 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][4]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 32 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][6]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 37 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][8]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 42 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][10]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 47 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][12]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 52 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][14]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 57 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][16]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age < 62 && age >= 0) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][18]) {
            return scoresArray[i][0]
          }
        }
      }
      else if (age >= 62) {
        for (var i=0; i<scoresArray.length; i++) {
          if (input <= scoresArray[i][20]) {
            return scoresArray[i][0]
          }
        }
      }
      else {
        return 0
      }
    }
    else {
      return 0
    }
  }
}