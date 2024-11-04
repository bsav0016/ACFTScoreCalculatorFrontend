import { Text, View, TextInput, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightFromBracket, faPenToSquare, faFloppyDisk, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import Dialog from 'react-native-dialog';
import ACFTBannerAd from '../ACFTBannerAd';
import { backendUrl } from '../constants';
import profileStyles from './profileStyles';


export default function Profile(props) { 
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
  const [visible, setVisible] = useState(false)

  var token = null;
  var id = null;

  useEffect(() => {
    getData(true)
  }, [])

  const getData = async (first) => {
    token = await AsyncStorage.getItem('MR_token');
    id = await AsyncStorage.getItem('user_id');
    if (id === null) {
        props.navigation.navigate("Auth")
    }
    if (first) {
      setData(id)
    }
  };

  const setData = async (id) => {
    await fetch(`${backendUrl}api/users/${id}/`, {
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
    fetch(`${backendUrl}api/users/${id}/`, {
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
    fetch(`${backendUrl}api/users/${id}/`, {
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

  const checkPassword = async () => {
    await getData(false)
    fetch(`${backendUrl}api/authenticate/`, {
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={profileStyles.container}>

        <Dialog.Container visible={visible}>
          <Dialog.Title>Confirm with Password</Dialog.Title>
          <Dialog.Description>
            Please input your password to update account info.
          </Dialog.Description>
          <Dialog.Input placeholder={"Password"} onChangeText={setPassword}/>
          <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
          <Dialog.Button label="Confirm" onPress={checkPassword} />
        </Dialog.Container>

        <View style={profileStyles.rowContainer}>
          <Text style={profileStyles.label}>Username:</Text>
          {editUsername ?
          <View style={profileStyles.rowContainer}> 
            <TextInput placeholder={"Username"} onChangeText={setUsername} style={profileStyles.textInput}/>
            <TouchableOpacity onPress={doEditUsername}>
              <FontAwesomeIcon icon={faFloppyDisk} style={profileStyles.saveIcon} size={25}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setUsername(prevUsername)
              setEditUsername(false)
            }}>
              <FontAwesomeIcon icon={faRotateLeft} style={profileStyles.undo} size={23}/>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity style={profileStyles.rowContainer}>
            <Text style={profileStyles.input}>{username}</Text>
          </TouchableOpacity>
          }
        </View>

        <View style={profileStyles.rowContainer}>
          <Text style={profileStyles.label}>Email:</Text>
          {editEmail ?
          <View style={profileStyles.rowContainer}> 
            <TextInput keyboardType={'email-address'} placeholder={"Email"} onChangeText={setEmail} style={profileStyles.textInput}/>
            <TouchableOpacity onPress={doEditEmail}>
              <FontAwesomeIcon icon={faFloppyDisk} style={profileStyles.saveIcon} size={25}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setEmail(prevEmail)
              setEditEmail(false)
            }}>
              <FontAwesomeIcon icon={faRotateLeft} style={profileStyles.undo} size={23}/>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity onPress={doEditEmail} style={profileStyles.rowContainer}>
            <Text style={profileStyles.input}>{email}</Text>
            <FontAwesomeIcon style={profileStyles.editIcon} icon={faPenToSquare}/>
          </TouchableOpacity>
          }
        </View>

        <View style={profileStyles.rowContainer}>
          <Text style={profileStyles.label}>First Name:</Text>
          {editFirstName ?
          <View style={profileStyles.rowContainer}> 
            <TextInput placeholder={"First Name"} onChangeText={setFirstName} style={profileStyles.textInput}/>
            <TouchableOpacity onPress={doEditFirstName}>
              <FontAwesomeIcon icon={faFloppyDisk} style={profileStyles.saveIcon} size={25}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setFirstName(prevFirstName)
              setEditFirstName(false)
            }}>
              <FontAwesomeIcon icon={faRotateLeft} style={profileStyles.undo} size={23}/>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity onPress={doEditFirstName} style={profileStyles.rowContainer}>
            <Text style={profileStyles.input}>{firstName}</Text>
            <FontAwesomeIcon style={profileStyles.editIcon} icon={faPenToSquare}/>
          </TouchableOpacity>
          }
        </View>

        <View style={profileStyles.rowContainer}>
          <Text style={profileStyles.label}>Last Name:</Text>
          {editLastName ?
          <View style={profileStyles.rowContainer}> 
            <TextInput placeholder={"Last Name"} onChangeText={setLastName} style={profileStyles.textInput}/>
            <TouchableOpacity onPress={doEditLastName}>
              <FontAwesomeIcon icon={faFloppyDisk} style={profileStyles.saveIcon} size={25}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setLastName(prevLastName)
              setEditLastName(false)
            }}>
              <FontAwesomeIcon icon={faRotateLeft} style={profileStyles.undo} size={23}/>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity onPress={doEditLastName} style={profileStyles.rowContainer}>
            <Text style={profileStyles.input}>{lastName}</Text>
            <FontAwesomeIcon style={profileStyles.editIcon} icon={faPenToSquare}/>
          </TouchableOpacity>
          }
        </View>

        <View style={profileStyles.rowContainer}>
          <Text style={profileStyles.label}>ACFT Results: </Text>
          {(acftResults === undefined || acftResults.length === 0) ?
          <Text style={{fontSize: 20, color: '#FEC029', paddingTop: 8}}>None</Text> :
          <TouchableOpacity onPress={goToAcftResults}>
            <Text style={{color: 'white', paddingTop: 8, fontSize: 20, textDecorationLine: 'underline'}}>View All</Text>
          </TouchableOpacity>
          }
        </View>

        <View style={{paddingTop: 20}}/>

        <TouchableOpacity onPress={signOut} style={profileStyles.button}>
          <Text style={profileStyles.signOutText}>Sign Out</Text>
          <FontAwesomeIcon style={{color: 'red'}} icon={faArrowRightFromBracket}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={showConfirmDialog} style={profileStyles.button}>
          <Text style={{color: 'red', fontSize: 18, paddingRight: 10}}>Delete Account</Text>
          <FontAwesomeIcon style={{color: 'red'}} icon={faTrash} size={15}/>
        </TouchableOpacity>

        </View>
      <ACFTBannerAd/>
    </SafeAreaView>
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
