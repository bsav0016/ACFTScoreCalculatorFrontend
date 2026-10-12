import React, { useState, useEffect, useRef } from "react";
import { Text, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { backendUrl } from "../constants";
import { Card, LabeledInput, ScrollIntoViewContext, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';

export default function Auth(props) {
    const { scrollProps, ensureVisible } = useKeepFocusedVisible();
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
        <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollIntoViewContext.Provider value={ensureVisible}>
            <ScrollView {...scrollProps} contentContainerStyle={{padding: space.lg}} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                <Text style={font.title}>{regView ? "Create account" : "Welcome back"}</Text>
                <Text style={[font.caption, {marginTop: 4, marginBottom: space.lg}]}>
                    {regView ? "Save your scores and see how you rank." : "Sign in to save scores and see your history."}
                </Text>

                <Card>
                    <LabeledInput
                        label="Username"
                        onChangeText={text => setUsername(text)}
                        value={username}
                        autoCapitalize={'none'}
                        returnKeyType={'next'}
                        onSubmitEditing={() => passwordInput.current.focus()}
                    />
                    <LabeledInput
                        label="Password"
                        onChangeText={text => setPassword(text)}
                        value={password}
                        autoCapitalize={'none'}
                        secureTextEntry={true}
                        returnKeyType={regView ? 'next' : 'go'}
                        inputRef={passwordInput}
                        onSubmitEditing={regView ? () => passwordInput2.current.focus() : () => auth()}
                    />
                    {regView &&
                    <>
                        <LabeledInput
                            label="Confirm password"
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                            autoCapitalize={'none'}
                            secureTextEntry={true}
                            returnKeyType={'next'}
                            inputRef={passwordInput2}
                            onSubmitEditing={() => emailInput.current.focus()}
                        />
                        <LabeledInput
                            label="Email"
                            onChangeText={text => setEmail(text)}
                            value={email}
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            inputRef={emailInput}
                            onSubmitEditing={() => firstNameInput.current.focus()}
                        />
                        <LabeledInput
                            label="First name"
                            onChangeText={text => setFirstName(text)}
                            value={firstName}
                            returnKeyType={'next'}
                            inputRef={firstNameInput}
                            onSubmitEditing={() => lastNameInput.current.focus()}
                        />
                        <LabeledInput
                            label="Last name"
                            onChangeText={text => setLastName(text)}
                            value={lastName}
                            returnKeyType={'done'}
                            inputRef={lastNameInput}
                        />
                    </>
                    }
                </Card>

                {loading ?
                <ActivityIndicator size="large" color={colors.gold} style={{marginTop: space.lg}}/>
                :
                <Button title={regView ? "Register" : "Login"} onPress={() => auth()} style={{marginTop: space.sm}} />
                }
                <Button
                    variant="text"
                    onPress={() => toggleView()}
                    title={regView ? "Already have an account? Login here." : "Don't have an account? Register here."}
                    style={{marginTop: space.sm}}
                />
            </ScrollView>
            </ScrollIntoViewContext.Provider>
            </KeyboardAvoidingView>
            <ACFTBannerAd/>
        </SafeAreaView>
    )
}
