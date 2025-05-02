import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ACFTBannerAd from '../ACFTBannerAd';
import { backendUrl } from "../constants";
import authStyles from './authStyles';

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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setRegView(false)
        getData();
    }, [])

    const login = async () => {
        setLoading(true)
        await fetch(`${backendUrl}api/authenticate/`, {
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
                alert("Incorrect username or password");
            }
            setLoading(false);
        })
        .catch( () => {
            error => console.log(error)
            setLoading(false)
        })
    }

    const auth = async () => {
        if(regView) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            let tempEmail = email.replace(/\s+/g, '')
            if (username === '') {
                alert("Username field must not be blank");
                return;
            }
            else if (username.length > 30) {
                alert("Username field must not be more than 30 characters");
                return;
            }
            else if (password.length < 6) {
                alert("Password must be at least 6 characters long. It is recommended you mix letters, digits, and special characters.");
                return;
            }
            else if (password.length > 30) {
                alert("Password must be no more than 30 characters.");
                return;
            }
            else if (confirmPassword !== password) {
                alert("Passwords must match");
                return;
            }
            else if (reg.test(tempEmail) === false) {
                alert("Must be valid email address");
                return;
            }
            else if (tempEmail.length > 50) {
                alert("Email must not be more than 50 characters");
                return;
            }
            else if (firstName === '') {
                alert("First Name must not be blank");
                return;
            }
            else if (firstName.length > 30) {
                alert("First Name must not be more than 30 characters");
                return;
            }
            else if (lastName === '') {
                alert("Last Name must not be blank");
                return;
            }
            else if (lastName.length > 30) {
                alert("Last Name must not be more than 30 characters");
                return;
            }
            setLoading(true);
            await fetch(`${backendUrl}api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password, first_name: firstName,
                    last_name: lastName, email: tempEmail })
            })
            .then( async res => {
                const data = await res.json()
                if (!res.ok) {
                    console.log("Error response: ", data);
                    console.log(data.email)
                    if (data.email && data.email[0].includes("user with this Email")) {
                        alert('Email already taken')
                    } else if (data.username && data.username[0].includes("user with this Username")) {
                        alert('Username already taken')
                    } else {
                        alert("Unknown error")
                    }
                    throw new Error("API error");
                } 
                return data
            })
            .then( async res => {
                console.log(res);
                let usernameField = res.username
                let emailField = res.email
                if (emailField === undefined) {
                    emailField = ["It's fine"]
                }
                if (usernameField === undefined) {
                    usernameField = ["It's fine"]
                }
                if (emailField.includes("user with this Email already exists.")){
                    alert("Email is already in use");
                    setLoading(false);
                    return;
                }
                else if (usernameField.includes("user with this Username already exists.")) {
                    alert("Username already in use");
                    setLoading(false);
                    return;
                }
                else if (res.id === undefined) {
                    console.log(res)
                    alert("Unknown error")
                    setLoading(false)
                    return
                }
                else {
                    await login();
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            })
        }
        else {
            await login();
        }
    }

    const saveData = async (token, id) => {
        await AsyncStorage.setItem('MR_token', token)
        await AsyncStorage.setItem('user_id', id.toString())
    }

    const getData = async () => {
        const token = await AsyncStorage.getItem('MR_token');
        if (token) {
            props.navigation.navigate("Profile")
        }
    }

    const toggleView = () => {
        setRegView(!regView)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <View style={authStyles.container}>
                {!regView ? <Text style={authStyles.label}>Username</Text> : <Text/>}
                <TextInput
                    style={authStyles.input}
                    placeholder="Username"
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={text => setUsername(text)}
                    value={username}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordInput.current.focus()}
                />
                {!regView ? <Text style={authStyles.label}>Password</Text> : <View/>}
                <TextInput
                    style={authStyles.input}
                    placeholder="Password"
                    placeholderTextColor={'#a9a9a9'}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    ref={passwordInput}
                    onSubmitEditing={regView ? () => passwordInput2.current.focus() : () => {}}
                />
                {regView &&
                <View>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setConfirmPassword(text)}
                        value={confirmPassword}
                        autoCapitalize={'none'}
                        secureTextEntry={true}
                        ref={passwordInput2}
                        onSubmitEditing={() => emailInput.current.focus()}
                    />
                    <TextInput
                        style={authStyles.input}
                        placeholder="Email"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setEmail(text)}
                        value={email}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        ref={emailInput}
                        onSubmitEditing={() => firstNameInput.current.focus()}
                    />
                    <TextInput
                        style={authStyles.input}
                        placeholder="First Name"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setFirstName(text)}
                        value={firstName}
                        ref={firstNameInput}
                        onSubmitEditing={() => lastNameInput.current.focus()}
                    />
                    <TextInput
                        style={authStyles.input}
                        placeholder="Last Name"
                        placeholderTextColor={'#a9a9a9'}
                        onChangeText={text => setLastName(text)}
                        value={lastName}
                        ref={lastNameInput}
                    />
                </View>
                }
                {loading ?
                <ActivityIndicator size="medium" color="#ffffff" style={{marginTop: 15}}/>
                :
                <TouchableOpacity onPress={() => auth()} style={authStyles.button}>
                    <Text style={authStyles.buttonTextStyle}>
                        {regView ? "Register" : "Login"}
                    </Text>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => toggleView()}>
                    {regView ? <Text style={authStyles.viewText}>Already have an account? Login here.</Text> :
                    <Text style={authStyles.viewText}>Don't have an account? Register here.</Text>}
                </TouchableOpacity>
            </View>
            <ACFTBannerAd/>
        </SafeAreaView>
    )
}