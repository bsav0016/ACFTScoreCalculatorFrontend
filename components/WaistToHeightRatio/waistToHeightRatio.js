import { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, ScrollView, Platform, KeyboardAvoidingView, Keyboard, StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import ACFTBannerAd from "../ACFTBannerAd";
import { Card, Field, ResultRow, ScrollIntoViewContext, useKeepFocusedVisible } from '../ui';
import { colors, font, radius, space } from '../theme';

const invalidParameters = "[Invalid input]";
const failThreshold = 0.55;

const isValidHalfIncrement = (value) => /^\d+(\.5)?$/.test(value.trim());
const isValidHeight = isValidHalfIncrement;
const isValidWaist = isValidHalfIncrement;
const floorToThousandths = (value) => Math.floor(value * 1000) / 1000;

export default function WaistToHeightRatio(props) {
    const [height, setHeight] = useState('');
    const [waist1, setWaist1] = useState('');
    const [waist2, setWaist2] = useState('');
    const [waist3, setWaist3] = useState('');
    const [avgWaist, setAvgWaist] = useState(invalidParameters);
    const [ratio, setRatio] = useState(invalidParameters);

    const [keyboardOpen, setKeyboardOpen] = useState(false);

    const waist1Ref = useRef();
    const waist2Ref = useRef();
    const waist3Ref = useRef();

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
        calculateAvgWaist();
    }, [waist1, waist2, waist3]);

    useEffect(() => {
        calculateRatio();
    }, [avgWaist, height]);

    const calculateAvgWaist = () => {
        try {
            if (!isValidWaist(waist1) || !isValidWaist(waist2) || !isValidWaist(waist3)) {
                throw new Error('Invalid inputs');
            }
            const newAvgWaist = floorToThousandths((parseFloat(waist1) + parseFloat(waist2) + parseFloat(waist3)) / 3);
            setAvgWaist(newAvgWaist.toFixed(3));
        } catch {
            setAvgWaist(invalidParameters);
        }
    }

    const calculateRatio = () => {
        try {
            if (avgWaist === invalidParameters || !isValidHeight(height)) {
                throw new Error('Invalid inputs');
            }
            const newRatio = floorToThousandths(parseFloat(avgWaist) / parseFloat(height));
            setRatio(newRatio.toFixed(3));
        } catch {
            setRatio(invalidParameters);
        }
    }

    const passed = ratio !== invalidParameters && parseFloat(ratio) < failThreshold;

    const { scrollProps, ensureVisible } = useKeepFocusedVisible();
    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const valid = ratio !== invalidParameters
    const show = (value) => (value === invalidParameters ? '—' : value)

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
            <Container style={{flex: 1}} behavior="padding">
                <ScrollIntoViewContext.Provider value={ensureVisible}>
                <ScrollView
                    {...scrollProps}
                    contentContainerStyle={{padding: space.lg}}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <Text style={[font.caption, {marginBottom: space.md}]}>
                        All measurements must be in 0.5 increments (round up for height and down for waist).
                    </Text>

                    <Card>
                        <Text style={font.heading}>Height</Text>
                        <Field label="Height (in)" value={height} onChangeText={setHeight} placeholder="e.g. 68"
                            onSubmitEditing={() => waist1Ref.current.focus()}/>
                    </Card>

                    <Card>
                        <Text style={font.heading}>Waist measurements</Text>
                        <Field label="Measurement 1" value={waist1} onChangeText={setWaist1} placeholder="e.g. 34.5"
                            inputRef={waist1Ref} onSubmitEditing={() => waist2Ref.current.focus()}/>
                        <Field label="Measurement 2" value={waist2} onChangeText={setWaist2} placeholder="e.g. 34.5"
                            inputRef={waist2Ref} onSubmitEditing={() => waist3Ref.current.focus()}/>
                        <Field label="Measurement 3" value={waist3} onChangeText={setWaist3} placeholder="e.g. 34.5"
                            inputRef={waist3Ref} returnKeyType="done"/>
                    </Card>

                    <Card>
                        <ResultRow label="Average waist" value={show(avgWaist)}/>
                        <ResultRow label="Waist-to-height ratio" value={show(ratio)} large/>
                        <Text style={[font.caption, {marginTop: space.sm}]}>Standard: below {failThreshold}</Text>
                        {valid &&
                            <View style={[styles.verdict, {borderColor: passed ? colors.success : colors.danger}]}>
                                <FontAwesomeIcon icon={passed ? faCheck : faXmark} size={20}
                                    color={passed ? colors.success : colors.danger}/>
                                <Text style={[styles.verdictText, {color: passed ? colors.success : colors.danger}]}>
                                    {passed ? 'Pass' : 'Fail'}
                                </Text>
                            </View>
                        }
                    </Card>
                </ScrollView>
                </ScrollIntoViewContext.Provider>
                <ACFTBannerAd/>
            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    verdict: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: radius.md,
        paddingVertical: 10,
        marginTop: space.md,
    },
    verdictText: { fontSize: 20, fontWeight: '800', marginLeft: space.sm },
});
