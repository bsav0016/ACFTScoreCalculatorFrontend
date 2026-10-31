import React, { useEffect, useRef, useState } from "react";
import { Text, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { Card, LabeledInput, ScrollIntoViewContext, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';
import { confirmPasswordReset, requestPasswordReset } from '../session';
import { newPasswordProblem, serverPasswordMessage } from '../passwordRules';

const RESEND_SECONDS = 60; // the server sends at most one code a minute per account

export default function ForgotPassword(props) {
    const { scrollProps, ensureVisible } = useKeepFocusedVisible();
    const codeInput = useRef();
    const passwordInput = useRef();
    const confirmInput = useRef();

    const [step, setStep] = useState('email') // 'email' asks for the address, 'code' takes the code and new password
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(0)

    useEffect(() => {
        if (secondsLeft <= 0) return
        const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000)
        return () => clearTimeout(timer)
    }, [secondsLeft])

    const sendCode = async () => {
        if (!email.trim()) {
            alert("Enter the email address you signed up with.")
            return
        }
        setLoading(true)
        const result = await requestPasswordReset(email)
        setLoading(false)
        if (result.ok) {
            setStep('code')
            setSecondsLeft(RESEND_SECONDS)
        }
        else if (result.kind === 'throttled') {
            alert("Too many requests. Please try again in a while.")
        }
        else if (result.kind === 'network') {
            alert("Couldn't reach the server. Check your connection and try again.")
        }
        else {
            alert("Something went wrong. Please try again.")
        }
    }

    const resetPassword = async () => {
        if (!email.trim()) {
            alert("Enter the email address you signed up with.")
            return
        }
        if (!/^\d{6}$/.test(code.trim())) {
            alert("The code is six digits, from the email we sent you.")
            return
        }
        const problem = newPasswordProblem(password, confirmPassword)
        if (problem) {
            alert(problem)
            return
        }
        setLoading(true)
        const result = await confirmPasswordReset({ email, code, newPassword: password })
        setLoading(false)
        if (result.ok) {
            alert("Your password has been changed. Sign in with your new password.")
            props.navigation.navigate("Auth")
        }
        else if (result.kind === 'invalid_code') {
            alert("That code is not valid or has expired. Ask for a new one.")
        }
        else if (result.kind === 'weak') {
            alert(serverPasswordMessage(result.messages))
        }
        else if (result.kind === 'throttled') {
            alert("Too many attempts. Please try again in a while.")
        }
        else if (result.kind === 'network') {
            alert("Couldn't reach the server. Check your connection and try again.")
        }
        else {
            alert("Something went wrong. Please try again.")
        }
    }

    const emailStep = step === 'email'

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollIntoViewContext.Provider value={ensureVisible}>
            <ScrollView {...scrollProps} contentContainerStyle={{padding: space.lg}} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                <Text style={font.title}>Reset your password</Text>
                <Text style={[font.caption, {marginTop: 4, marginBottom: space.lg}]}>
                    {emailStep
                        ? "Enter the email address you signed up with and we'll send you a six-digit code."
                        : "If that email belongs to an account, a code is on its way. It works for 15 minutes."}
                </Text>

                <Card>
                    <LabeledInput
                        label="Email"
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        returnKeyType={emailStep ? 'send' : 'next'}
                        onSubmitEditing={emailStep ? sendCode : () => codeInput.current.focus()}
                    />
                    {!emailStep &&
                    <>
                        <LabeledInput
                            label="Code"
                            onChangeText={setCode}
                            value={code}
                            keyboardType={'number-pad'}
                            maxLength={6}
                            returnKeyType={'next'}
                            inputRef={codeInput}
                            onSubmitEditing={() => passwordInput.current.focus()}
                        />
                        <LabeledInput
                            label="New password"
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize={'none'}
                            secureTextEntry={true}
                            returnKeyType={'next'}
                            inputRef={passwordInput}
                            onSubmitEditing={() => confirmInput.current.focus()}
                        />
                        <LabeledInput
                            label="Confirm new password"
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            autoCapitalize={'none'}
                            secureTextEntry={true}
                            returnKeyType={'go'}
                            inputRef={confirmInput}
                            onSubmitEditing={resetPassword}
                        />
                    </>
                    }
                </Card>

                {loading ?
                <ActivityIndicator size="large" color={colors.gold} style={{marginTop: space.lg}}/>
                :
                <Button
                    title={emailStep ? "Send code" : "Reset password"}
                    onPress={emailStep ? sendCode : resetPassword}
                    style={{marginTop: space.sm}}
                />
                }
                {emailStep ?
                <Button
                    variant="text"
                    title="I already have a code"
                    onPress={() => setStep('code')}
                    style={{marginTop: space.sm}}
                />
                :
                <Button
                    variant="text"
                    title={secondsLeft > 0 ? `Send a new code (${secondsLeft})` : "Send a new code"}
                    disabled={secondsLeft > 0 || loading}
                    onPress={sendCode}
                    style={{marginTop: space.sm}}
                />
                }
                <Button
                    variant="text"
                    title="Back to sign in"
                    onPress={() => props.navigation.navigate("Auth")}
                    style={{marginTop: space.sm}}
                />
            </ScrollView>
            </ScrollIntoViewContext.Provider>
            </KeyboardAvoidingView>
            <ACFTBannerAd/>
        </SafeAreaView>
    )
}
