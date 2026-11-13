import React, { useState, useEffect, useRef } from "react";
import { Text, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import { getSession, setSession } from "../session";
import { newPasswordProblem, serverPasswordMessage } from "../passwordRules";
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { backendUrl } from "../constants";
import { Card, LabeledInput, ScrollIntoViewContext, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';
import { notify } from '../notify';
import { reportError } from '../errorReporting';

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
        try {
            const res = await fetch(`${backendUrl}api/authenticate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            const data = await res.json()
            if (data.token) {
                await setSession(data.token, data.id)
                props.navigation.navigate("Profile")
            }
            else {
                notify("Incorrect username or password");
            }
        } catch (error) {
            notify("Couldn't reach the server. Check your connection and try again.")
            // A TypeError from fetch means the phone was offline; anything else (an unreadable reply) is worth knowing.
            if (!(error instanceof TypeError)) reportError(error, 'login')
        }
        setLoading(false)
    }

    const auth = async () => {
        if(regView) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            let tempEmail = email.replace(/\s+/g, '')
            if (username === '') {
                notify("Username field must not be blank");
                return;
            }
            else if (username.length > 30) {
                notify("Username field must not be more than 30 characters");
                return;
            }
            else if (newPasswordProblem(password, confirmPassword)) {
                notify(newPasswordProblem(password, confirmPassword));
                return;
            }
            else if (reg.test(tempEmail) === false) {
                notify("Must be valid email address");
                return;
            }
            else if (tempEmail.length > 50) {
                notify("Email must not be more than 50 characters");
                return;
            }
            else if (firstName === '') {
                notify("First Name must not be blank");
                return;
            }
            else if (firstName.length > 30) {
                notify("First Name must not be more than 30 characters");
                return;
            }
            else if (lastName === '') {
                notify("Last Name must not be blank");
                return;
            }
            else if (lastName.length > 30) {
                notify("Last Name must not be more than 30 characters");
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
                    if (data.email && data.email[0].includes("user with this Email")) {
                        notify('Email already taken')
                    } else if (data.username && data.username[0].includes("user with this Username")) {
                        notify('Username already taken')
                    } else if (data.password) {
                        notify(serverPasswordMessage(data.password))
                    } else {
                        notify("Unknown error")
                        reportError(new Error(`Registration failed with status ${res.status}`), 'register')
                    }
                    throw new Error("API error");
                } 
                return data
            })
            .then( async res => {
                let usernameField = res.username
                let emailField = res.email
                if (emailField === undefined) {
                    emailField = ["It's fine"]
                }
                if (usernameField === undefined) {
                    usernameField = ["It's fine"]
                }
                if (emailField.includes("user with this Email already exists.")){
                    notify("Email is already in use");
                    setLoading(false);
                    return;
                }
                else if (usernameField.includes("user with this Username already exists.")) {
                    notify("Username already in use");
                    setLoading(false);
                    return;
                }
                else if (res.id === undefined) {
                    notify("Unknown error")
                    reportError(new Error('Registration reply had no account id'), 'register')
                    setLoading(false)
                    return
                }
                else {
                    await login();
                }
                setLoading(false);
            })
            .catch(error => {
                // "API error" was already explained to the person above; anything else is a network or reading failure.
                if (error.message !== "API error") {
                    notify("Couldn't reach the server. Check your connection and try again.")
                    if (!(error instanceof TypeError)) reportError(error, 'register')
                }
                setLoading(false);
            })
        }
        else {
            await login();
        }
    }

    const getData = async () => {
        if (await getSession()) {
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
                {!regView &&
                <Button
                    variant="text"
                    onPress={() => props.navigation.navigate("ForgotPassword")}
                    title="Forgot your password?"
                    style={{marginTop: space.sm}}
                />
                }
                {!regView &&
                <Button
                    variant="text"
                    onPress={() => props.navigation.navigate("ForgotUsername")}
                    title="Forgot your username?"
                    style={{marginTop: space.sm}}
                />
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
