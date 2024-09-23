import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightFromBracket, faPenToSquare, faFloppyDisk, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import Dialog from 'react-native-dialog';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import ACFTBannerAd from './ACFTBannerAd';

export default function Profile(props) { 

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [editUsername, setEditUsername] = useState(false)
  const [prevUsername, setPrevUsername] = useState('')
  const [email, setEmail] = useState('')
  const [editEmail, setEditEmail] = useState(false)
  const [prevEmail, setPrevEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [editFirstName, setEditFirstName] = useState(false)
  const [prevFirstName, setPrevFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [editLastName, setEditLastName] = useState(false)
  const [prevLastName, setPrevLastName] = useState('')
  const [acftResults, setAcftResults] = useState([])
  const [paidFee, setPaidFee] = useState(false)

  const [paymentIntent, setPaymentIntent] = useState('')

  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)

  var token = null;
  var id = null;

  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    token = await AsyncStorage.getItem('MR_token');
    id = await AsyncStorage.getItem('user_id');
    if (id) {
    } else {
        console.log("No token")
        props.navigation.navigate("Auth")
    }
    if (first) {
      setData(id)
      initializePaymentSheet();
    }
  };

  const setData = (id) => {
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/${id}/`, {
    //fetch(`http://192.168.0.180:8000/api/users/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( res => res.json())
    .then( res => {
        if (res.username === undefined) {
          alert("Couldn't get account info")
          props.navigation.navigate("Auth")
        }
        else {
          setUsername(res.username)
          setEmail(res.email)
          setFirstName(res.first_name)
          setLastName(res.last_name)
          setAcftResults(res.acft_results)
          setPrevUsername(res.username)
          setPrevEmail(res.email)
          setPrevFirstName(res.first_name)
          setPrevLastName(res.last_name)
          setPaidFee(res.paid_fee)
        }
    })
    .catch( error => console.log(error))
  }

  const askToPayFee = () => {
    Alert.alert("Pay Fee?", "Would you like to pay $2 (w/ $0.40 Stripe fees) to save results? If you know the developer, reach out to directly and he'll waive it for you.",
      [
        {
        text: "Yes",
        onPress: () => {setVisible2(true)},
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

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`https://updated-acft-score-calculator.herokuapp.com/api/payment_sheets/1/payment_sheet/`, {
    //const response = await fetch(`http://192.168.0.180:8000/api/payment_sheets/1/payment_sheet/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
    
    const res = await response.json()

    if (res.message === "Stored Payment Sheet") {
      setPaymentIntent(res.paymentIntent)
      return [res.paymentIntent, res.ephemeralKey, res.customerId];
    }
    
    else {
      Alert.alert("Couldn't complete this task")
      return
    }
  };

  const initializePaymentSheet = async () => {
    const results = await fetchPaymentSheetParams();

    const newPaymentIntent = results[0]
    const newEphemeralKey = results[1]
    const newCustomer = results[2]

    const { error } = await initPaymentSheet({
      customerId: newCustomer,
      customerEphemeralKeySecret: newEphemeralKey,
      paymentIntentClientSecret: newPaymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      merchantDisplayName: 'Savidge Apps'
    });
    if (error) {
      Alert.alert(String(error.message))
    }
  };

  const payFee = async () => {
    const { error } = await presentPaymentSheet({ clientSecret: paymentIntent });

    if (error) {
      setVisible2(false)
      if (error.code !== "Canceled"){
        Alert.alert('Payment Not Processed', `Error code: ${error.message}`);
      }
    } else {
      setVisible2(false)
      setPaidFee(true)
      updatePaidFee()
      Alert.alert('Success', 'Your order is confirmed!');
    }
  }

  const updatePaidFee = async () => {
    await getData(false)    
    let tempEmail = email.replace(/\s+/g, '').toLowerCase()
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/${id}/`, {
    //fetch(`http://192.168.0.180:8000/api/users/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ username: username, password: password, first_name: firstName,
        last_name: lastName, email: tempEmail, acft_results: acftResults, paid_fee: true })
    })
    .catch( error => console.log(error))
  }

  const removeStorage = async () => {
    await AsyncStorage.removeItem('MR_token')
    await AsyncStorage.removeItem('user_id')
  }

  const signOut = () => {
    removeStorage()
    props.navigation.navigate("Auth")
  }

  const showConfirmDialog = () => {
    Alert.alert("Are you sure?", "Are you sure you want to delete this account?",
      [
        {
        text: "Yes",
        onPress: () => {deleteAccount()},
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

  const deleteAccount = async () => {
    await getData(false)
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/${id}/`, {
    //fetch(`http://192.168.0.180:8000/api/users/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
    .then( () => removeStorage())
    .then( () => {
      props.navigation.navigate("Auth")
      alert("Deleted account") 
    })
    .catch( error => alert(error))
  }

  const goToAcftResults = () => {
    props.navigation.navigate("ACFTResults")
  }

  const doEditEmail = (value) => {
    if (!editFirstName && !editLastName && !editUsername) {
      if (editEmail) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setEmail(prevEmail)
        }
      }
      setEditEmail(!editEmail)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditUsername = () => {
    if (!editFirstName && !editLastName && !editEmail) {
      if (editUsername) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setUsername(prevUsername)
        }
      }
      setEditUsername(!editUsername)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditFirstName = () => {
    if (!editEmail && !editLastName && !editUsername) {
      if (editFirstName) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setFirstName(prevFirstName)
        }
      }
      setEditFirstName(!editFirstName)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const doEditLastName = () => {
    if (!editFirstName && !editEmail && !editUsername) {
      if (editLastName) {
        if (checkInfo()) {
          setVisible(true)
        }
        else {
          setLastName(prevLastName)
        }
      }
      setEditLastName(!editLastName)
    }
    else{
      alert("Can only edit one at a time")
    }
  }

  const edittingEmail = (value) => {
    setEmail(value)
  }

  const edittingUsername = (value) => {
    setUsername(value)
  }

  const edittingFirstName = (value) => {
    setFirstName(value)
  }

  const edittingLastName = (value) => {
    setLastName(value)
  }

  const checkInfo = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let tempEmail = email.replace(/\s+/g, '').toLowerCase()
    if (username === '') {
        alert("Username field must not be blank")
        return false
    }
    else if (username.length > 30) {
        alert("Username field must not be more than 30 characters")
        return false
    }
    else if (reg.test(tempEmail) === false) {
        alert("Must be valid email address")
        return false
    }
    else if (tempEmail.length > 50) {
        alert("Email must not be more than 50 characters")
        return false
    }
    else if (firstName === '') {
        alert("First Name must not be blank")
        return false
    }
    else if (firstName.length > 30) {
        alert("First Name must not be more than 30 characters")
        return false
    }
    else if (lastName === '') {
        alert("Last Name must not be blank")
        return false
    }
    else if (lastName.length > 30) {
        alert("Last Name must not be more than 30 characters")
        return false
    }
    else {
      return true
    }
  }

  const saveInfo = async () => {
    await getData(false)    
    let tempEmail = email.replace(/\s+/g, '').toLowerCase()
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/${id}/`, {
    //fetch(`http://192.168.0.180:8000/api/users/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ username: username, password: password, first_name: firstName,
        last_name: lastName, email: tempEmail, acft_results: acftResults, paid_fee: paidFee })
    })
    .then( res => res.json() )
    .then( res => {
      let usernameField = res.username
      let emailField = res.email
      if (emailField === undefined) {
        emailField = ["It's fine"]
      }
      if (usernameField === undefined) {
        usernameField = ["It's fine"]
      }
      if (emailField.includes("user with this Email already exists.")){
        alert("Email is already in use")
        setEmail(prevEmail)
        return
      }
      else if (usernameField.includes("user with this Username already exists.")) {
        alert("Username already in use")
        return
      }
      else if (res.id === undefined) {
        alert("Unknown error")
        return
      }
      else {
        setUsername(username)
        setEmail(email)
        setFirstName(firstName)
        setLastName(lastName)
        setPrevUsername(username)
        setPrevEmail(email)
        setPrevFirstName(firstName)
        setPrevLastName(lastName)
        alert("Successfully updated account info")
      }
    })
    .catch( error => console.log(error))
  }

  const passwordInput = (value) => {
    setPassword(value)
  }

  const checkPassword = async () => {
    await getData(false)
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/authenticate/`, {
    //fetch(`http://192.168.0.180:8000/api/authenticate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: prevUsername, password: password })
    })
    .then( res => res.json())
    .then( res => {
        if (res.token) {
          saveInfo()
        }
        else {
          alert("Incorrect password")
          setEmail(prevEmail)
          setUsername(prevUsername)
          setFirstName(prevFirstName)
          setLastName(prevLastName)
        }
    })
    .catch( error => console.log(error))
    setVisible(false)
  }

  const checkPayPassword = async () => {
    await getData(false)
    fetch(`https://updated-acft-score-calculator.herokuapp.com/api/authenticate/`, {
    //fetch(`http://192.168.0.180:8000/api/authenticate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: prevUsername, password: password })
    })
    .then( res => res.json())
    .then( res => {
        if(res.token) {
          payFee()
        }
        else{
          alert("Incorrect new password")
        }
    })
    .catch( error => console.log(error))
  }

  return (
    <StripeProvider
      publishableKey="pk_live_51K3Z43KQPt6SvxbCYjiFsRWquBwI7abgPdxwRC4Qlma9myzEzKUwr0uCIc3URtyIF9O4Xkxws9fSyusrbr0aU22x00BOzYDqU7"
      //publishableKey='pk_test_51K3Z43KQPt6SvxbCq2DWQAxjj2fSskBhazWMiBI4WM6XRgOoDUSckkHxZzWaSXgIO55qf3EAi0lo2X4iab44nHIl00amJ9PVxZ'
      urlScheme="https://updated-acft-score-calculator.herokuapp.com" // required for 3D Secure and bank redirects
      //urlScheme="http://192.168.0.180:8000"
      merchantIdentifier="Savidge Apps" // required for Apple Pay
    >
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>

        <View style={styles.container}>

          <Dialog.Container visible={visible}>
            <Dialog.Title>Confirm with Password</Dialog.Title>
            <Dialog.Description>
              Please input your password to update account info.
            </Dialog.Description>
            <Dialog.Input placeholder={"Password"} onChangeText={passwordInput}/>
            <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
            <Dialog.Button label="Confirm" onPress={checkPassword} />
          </Dialog.Container>

          <Dialog.Container visible={visible2}>
            <Dialog.Title>Confirm with Password</Dialog.Title>
            <Dialog.Description>
              Please input your password to be redirected to pay fee.
            </Dialog.Description>
            <Dialog.Input placeholder={"Password"} onChangeText={passwordInput}/>
            <Dialog.Button label="Cancel" onPress={() => setVisible2(false)} />
            <Dialog.Button label="Confirm" onPress={checkPayPassword} />
          </Dialog.Container>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>Username:</Text>
            {editUsername ?
            <View style={styles.rowContainer}> 
              <TextInput placeholder={"Username"} onChangeText={edittingUsername} style={styles.textInput}/>
              <TouchableOpacity onPress={doEditUsername}>
                <FontAwesomeIcon icon={faFloppyDisk} style={styles.saveIcon} size={25}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setUsername(prevUsername)
                setEditUsername(false)
              }}>
                <FontAwesomeIcon icon={faRotateLeft} style={styles.undo} size={23}/>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity style={styles.rowContainer}>
              <Text style={styles.input}>{username}</Text>
            </TouchableOpacity>
            }
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>Email:</Text>
            {editEmail ?
            <View style={styles.rowContainer}> 
              <TextInput keyboardType={'email-address'} placeholder={"Email"} onChangeText={edittingEmail} style={styles.textInput}/>
              <TouchableOpacity onPress={doEditEmail}>
                <FontAwesomeIcon icon={faFloppyDisk} style={styles.saveIcon} size={25}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setEmail(prevEmail)
                setEditEmail(false)
              }}>
                <FontAwesomeIcon icon={faRotateLeft} style={styles.undo} size={23}/>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={doEditEmail} style={styles.rowContainer}>
              <Text style={styles.input}>{email}</Text>
              <FontAwesomeIcon style={styles.editIcon} icon={faPenToSquare}/>
            </TouchableOpacity>
            }
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>First Name:</Text>
            {editFirstName ?
            <View style={styles.rowContainer}> 
              <TextInput placeholder={"First Name"} onChangeText={edittingFirstName} style={styles.textInput}/>
              <TouchableOpacity onPress={doEditFirstName}>
                <FontAwesomeIcon icon={faFloppyDisk} style={styles.saveIcon} size={25}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setFirstName(prevFirstName)
                setEditFirstName(false)
              }}>
                <FontAwesomeIcon icon={faRotateLeft} style={styles.undo} size={23}/>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={doEditFirstName} style={styles.rowContainer}>
              <Text style={styles.input}>{firstName}</Text>
              <FontAwesomeIcon style={styles.editIcon} icon={faPenToSquare}/>
            </TouchableOpacity>
            }
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>Last Name:</Text>
            {editLastName ?
            <View style={styles.rowContainer}> 
              <TextInput placeholder={"Last Name"} onChangeText={edittingLastName} style={styles.textInput}/>
              <TouchableOpacity onPress={doEditLastName}>
                <FontAwesomeIcon icon={faFloppyDisk} style={styles.saveIcon} size={25}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setLastName(prevLastName)
                setEditLastName(false)
              }}>
                <FontAwesomeIcon icon={faRotateLeft} style={styles.undo} size={23}/>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={doEditLastName} style={styles.rowContainer}>
              <Text style={styles.input}>{lastName}</Text>
              <FontAwesomeIcon style={styles.editIcon} icon={faPenToSquare}/>
            </TouchableOpacity>
            }
            
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>ACFT Results: </Text>
            {(acftResults === undefined || acftResults.length === 0) ?
            <Text style={{fontSize: 20, color: '#FEC029', paddingTop: 8}}>None</Text> :
            <TouchableOpacity onPress={goToAcftResults}>
              <Text style={{color: 'white', paddingTop: 8, fontSize: 20, textDecorationLine: 'underline'}}>View All</Text>
            </TouchableOpacity>
            }
          </View>

          <View style={styles.rowContainer}>
            <Text style={styles.label}>Fee Paid?</Text>
            {paidFee ? 
            <Text style={styles.label}>Yes</Text>
            :
            <TouchableOpacity onPress={askToPayFee}>
              <Text style={{color: 'white', paddingTop: 8, fontSize: 20, textDecorationLine: 'underline'}}>Pay $2 to Save Results</Text>
            </TouchableOpacity>
            }
          </View>

          <View style={{paddingTop: 20}}/>

          <TouchableOpacity onPress={signOut} style={styles.button}>
            <Text style={styles.signOutText}>Sign Out</Text>
            <FontAwesomeIcon style={{color: 'red'}} icon={faArrowRightFromBracket}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={showConfirmDialog} style={styles.button}>
            <Text style={{color: 'red', fontSize: 18, paddingRight: 10}}>Delete Account</Text>
            <FontAwesomeIcon style={{color: 'red'}} icon={faTrash} size={15}/>
          </TouchableOpacity>

        </View>
        <ACFTBannerAd/>
    </SafeAreaView>
    </StripeProvider>
  );
}

Profile.navigationOptions = screenProps => ({
  title: "Profile",
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
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 0,
    backgroundColor: 'black',
    paddingVertical: 3,
    paddingHorizontal: 5
  },
  label: {
    fontSize: 20,
    padding: 8,
    color: '#FEC029',
    fontWeight: 'bold'
  },
  input: {
    fontSize: 20,
    padding: 5,
    color: '#FEC029'
  },
  otherInput: {
    fontSize: 20,
    padding: 8,
    color: '#FEC029'
  },
  signOutText: {
    color: 'red',
    fontSize: 18,
    paddingRight: 10
  },
  editIcon: {
    color: '#FEC029',
    marginTop: 10,
    marginLeft: 2
  },
  textInput: {
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  saveIcon: {
    color: '#FEC029',
    marginTop: 5,
    marginLeft: 15
  },
  undo: {
    color: '#FEC029',
    marginLeft: 15,
    marginTop: 5
  },
  button: {
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: '#FEC029',
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 3,
    padding: 5,
    alignItems: 'center'
  }
});