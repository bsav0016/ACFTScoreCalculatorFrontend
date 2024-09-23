import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TextInput, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-navigation";
import ACFTBannerAd from './ACFTBannerAd';

export default function Auth(props) {

    const passwordInput = useRef();
    const passwordInput2 = useRef();
    const firstNameInput = useRef();
    const lastNameInput = useRef();
    const emailInput = useRef();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [regView, setRegView] = useState(false)

    useEffect(() => {
        setRegView(false)
        getData();
    }, [])

    const login = async () => {
        fetch(`https://updated-acft-score-calculator.herokuapp.com/api/authenticate/`, {
        //fetch(`http://192.168.0.180:8000/api/authenticate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then( res => res.json())
            .then( res => {
                saveData(res.token, res.id)
                if (res.token) {
                    props.navigation.navigate("Profile")
                }
                else {
                    alert("Incorrect username or password")
                }
            })
            .catch( error => console.log(error))
    }

    const auth = async () => {
        if(regView) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            let tempEmail = email.replace(/\s+/g, '')
            if (username === '') {
                alert("Username field must not be blank")
                return
            }
            else if (username.length > 30) {
                alert("Username field must not be more than 30 characters")
                return
            }
            else if (password.length < 6) {
                alert("Password must be at least 8 characters long. It is recommended you mix letters, digits, and special characters.")
                return
            }
            else if (password.length > 30) {
                alert("Password must be no more than characters.")
                return
            }
            else if (confirmPassword !== password) {
                alert("Passwords must match")
                return
            }
            else if (reg.test(tempEmail) === false) {
                alert("Must be valid email address")
                return
            }
            else if (tempEmail.length > 50) {
                alert("Email must not be more than 50 characters")
                return
            }
            else if (firstName === '') {
                alert("First Name must not be blank")
                return
            }
            else if (firstName.length > 30) {
                alert("First Name must not be more than 30 characters")
                return
            }
            else if (lastName === '') {
                alert("Last Name must not be blank")
                return
            }
            else if (lastName.length > 30) {
                alert("Last Name must not be more than 30 characters")
                return
            }
            fetch(`https://updated-acft-score-calculator.herokuapp.com/api/users/`, {
            //fetch(`http://192.168.0.180:8000/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password, first_name: firstName,
                    last_name: lastName, email: tempEmail })
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
                    return
                }
                else if (usernameField.includes("user with this Username already exists.")) {
                    alert("Username already in use")
                    return
                }
                else if (res.id === undefined) {
                    console.log(res)
                    alert("Unknown error")
                    return
                }
                else {
                    login()
                }
            })
            .catch( error => console.log(error))
        }
        else {
            login()
        }
    }

    const saveData = async (token, id) => {
        await AsyncStorage.setItem('MR_token', token)
        await AsyncStorage.setItem('user_id', id.toString())
    }

    const getData = async () => {
        const token = await AsyncStorage.getItem('MR_token');
        const id = await AsyncStorage.getItem('user_id')
        if (token) props.navigation.navigate("Profile")
    }

    const toggleView = () => {
        setRegView(!regView)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <View style={styles.container}>
                {!regView ? <Text style={styles.label}>Username</Text> : <Text/>}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={text => setUsername(text)}
                    value={username}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordInput.current.focus()}
                    blurOnSubmit={false}
                />
                {!regView ? <Text style={styles.label}>Password</Text> : <View/>}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    ref={passwordInput}
                    blurOnSubmit={regView ? false : true}
                    onSubmitEditing={regView ? () => passwordInput2.current.focus() : () => {}}
                />
                {regView ? 
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setConfirmPassword(text)}
                        value={confirmPassword}
                        autoCapitalize={'none'}
                        secureTextEntry={true}
                        ref={passwordInput2}
                        onSubmitEditing={() => emailInput.current.focus()}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setEmail(text)}
                        value={email}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        ref={emailInput}
                        onSubmitEditing={() => firstNameInput.current.focus()}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setFirstName(text)}
                        value={firstName}
                        ref={firstNameInput}
                        onSubmitEditing={() => lastNameInput.current.focus()}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setLastName(text)}
                        value={lastName}
                        ref={lastNameInput}
                    />
                </View> :
                <View/>
                }
                <TouchableOpacity onPress={() => auth()} style={styles.button}>
                    <Text style={styles.buttonTextStyle}>
                        {regView ? "Register" : "Login"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleView()}>
                    {regView ? <Text style={styles.viewText}>Already have an account? Login here.</Text> :
                    <Text style={styles.viewText}>Don't have an account? Register here.</Text>}
                </TouchableOpacity>

            </View>
            <ACFTBannerAd/>
        </SafeAreaView>
    )
}

Auth.navigationOptions = screenProps => ({
    title: "Login",
    headerStyle: {
        backgroundColor: '#FEC029'
    },
    headerTintColor: '#000',
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#000'
    }
})

const styles = StyleSheet.create({
    container: {
      flex: 6
    },
    label: {
        fontSize: 24,
        color: 'white',
        padding: 10
    },
    input: {
        fontSize: 24,
        backgroundColor: '#fff',
        padding: 10,
        margin: 3
    },
    viewText: {
        color: 'white',
        fontSize: 20,
        paddingTop: 30,
        paddingHorizontal: 10
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: 'black',
        margin: 10,
        borderWidth: 2,
        borderColor: '#FEC029'
    },
    buttonTextStyle: {
        color: '#FEC029',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 24,
        textAlign: 'center'
    },
  });