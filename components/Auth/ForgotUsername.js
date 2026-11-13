import React, { useState } from "react";
import { Text, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { Card, LabeledInput, ScrollIntoViewContext, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';
import { requestUsernameReminder } from '../session';
import { notify } from '../notify';
import { reportError } from '../errorReporting';

export default function ForgotUsername(props) {
    const { scrollProps, ensureVisible } = useKeepFocusedVisible();

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const send = async () => {
        if (!email.trim()) {
            notify("Enter the email address you signed up with.")
            return
        }
        setLoading(true)
        const result = await requestUsernameReminder(email)
        setLoading(false)
        if (result.ok) {
            setSent(true)
        }
        else if (result.kind === 'throttled') {
            notify("Too many requests. Please try again in a while.")
        }
        else if (result.kind === 'network') {
            notify("Couldn't reach the server. Check your connection and try again.")
        }
        else {
            notify("Something went wrong. Please try again.")
            reportError(new Error('Username reminder got an unexpected answer'), 'username-reminder')
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollIntoViewContext.Provider value={ensureVisible}>
            <ScrollView {...scrollProps} contentContainerStyle={{padding: space.lg}} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                <Text style={font.title}>Find your username</Text>
                <Text style={[font.caption, {marginTop: 4, marginBottom: space.lg}]}>
                    {sent
                        ? "If that email belongs to an account, we've sent the username to it. Check your spam folder if it doesn't arrive within a few minutes."
                        : "Enter the email address you signed up with and we'll email you your username."}
                </Text>

                <Card>
                    <LabeledInput
                        label="Email"
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        returnKeyType={'send'}
                        onSubmitEditing={send}
                    />
                </Card>

                {loading ?
                <ActivityIndicator size="large" color={colors.gold} style={{marginTop: space.lg}}/>
                :
                <Button
                    title={sent ? "Send again" : "Email my username"}
                    onPress={send}
                    style={{marginTop: space.sm}}
                />
                }
                <Button
                    variant="text"
                    title="Back to login"
                    onPress={() => props.navigation.navigate("Auth")}
                    style={{marginTop: space.sm}}
                />
                <Button
                    variant="text"
                    title="Forgot your password too?"
                    onPress={() => props.navigation.navigate("ForgotPassword")}
                    style={{marginTop: space.sm}}
                />
            </ScrollView>
            </ScrollIntoViewContext.Provider>
            </KeyboardAvoidingView>
            <ACFTBannerAd/>
        </SafeAreaView>
    )
}
