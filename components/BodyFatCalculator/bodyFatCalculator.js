import { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import ACFTBannerAd from "../ACFTBannerAd";
import SourceNote from '../SourceNote';
import { SOURCES } from '../sources';
import { assessBodyFat, bodyFatPercent, screeningWeights, BodyCompositionError, parseAge, parseHeight, parseWaist, parseWeight } from "./bodyComposition";
import { Card, Field, ResultRow, ScrollIntoViewContext, SectionLabel, Segmented, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';

export default function BodyFatCalculator(props) {
    const [isMale, setIsMale] = useState(true);
    const [waistSize, setWaistSize] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');

    const [, setKeyboardOpen] = useState(false);
    
    const waistRef = useRef();
    const weightRef = useRef();
    const heightRef = useRef();

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

    // Run a calculation; a BodyCompositionError becomes { error } instead of being thrown.
    const attempt = (calculate) => {
        try {
            return { value: calculate() };
        } catch (error) {
            if (!(error instanceof BodyCompositionError)) throw error;
            return { error };
        }
    };
    // A field that is still empty shows no message; anything else the user typed that doesn't fit does.
    const messageFor = (result) => (result.error && result.error.code !== 'missing' ? result.error.message : undefined);

    const ageCheck = attempt(() => parseAge(age));
    const heightCheck = attempt(() => parseHeight(height, isMale));
    const weightCheck = attempt(() => parseWeight(weight));
    const waistCheck = attempt(() => parseWaist(waistSize, isMale));
    const screening = attempt(() => screeningWeights({ isMale, age, height }));
    const bodyFat = attempt(() => assessBodyFat({ isMale, age, weight, waist: waistSize }));
    const estimate = attempt(() => bodyFatPercent({ isMale, weight, waist: waistSize }));

    const { scrollProps, ensureVisible } = useKeepFocusedVisible();
    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const show = (value) => (value === undefined ? '—' : String(value))
    const percent = estimate.value ? estimate.value.display + '%' : undefined;
    const verdict = bodyFat.value
        ? (bodyFat.value.withinLimit
            ? `Within the ${bodyFat.value.limit}% limit`
            : `Over the ${bodyFat.value.limit}% limit`)
        : undefined;

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
                    <Card>
                        <SectionLabel>Sex</SectionLabel>
                        <Segmented
                            options={[{value: true, label: 'Male'}, {value: false, label: 'Female'}]}
                            value={isMale}
                            onChange={setIsMale}
                        />
                    </Card>

                    <Card>
                        <Text style={font.heading}>Height & weight range</Text>
                        <Field label="Age" value={age} onChangeText={setAge} placeholder="17-99" error={messageFor(ageCheck)}
                            onSubmitEditing={() => heightRef.current.focus()}/>
                        <Field label="Height (in)" value={height} onChangeText={setHeight} placeholder="58-80" error={messageFor(heightCheck)}
                            inputRef={heightRef} onSubmitEditing={() => weightRef.current.focus()}/>
                        <ResultRow label="Min weight" value={show(screening.value?.min)}/>
                        <ResultRow label="Max weight" value={show(screening.value?.max)}/>
                    </Card>

                    <Card>
                        <Text style={font.heading}>Body fat %</Text>
                        <Field label="Weight (lbs)" value={weight} onChangeText={setWeight} placeholder="90-250" error={messageFor(weightCheck)}
                            inputRef={weightRef} onSubmitEditing={() => waistRef.current.focus()}/>
                        <Field label="Waist (in)" value={waistSize} onChangeText={setWaistSize} placeholder="25-55" error={messageFor(waistCheck)}
                            inputRef={waistRef} returnKeyType="done"/>
                        <ResultRow label="Body fat" value={show(percent)} large/>
                        {verdict && (
                            <Text style={[font.body, {color: bodyFat.value.withinLimit ? colors.success : colors.danger, paddingTop: space.md}]}>
                                {verdict}
                            </Text>
                        )}
                        {!verdict && percent && ageCheck.error && (
                            <Text style={[font.caption, {paddingTop: space.md}]}>Enter your age above to compare with the allowable limit.</Text>
                        )}
                    </Card>

                    <SourceNote sources={[SOURCES.ar600_9, SOURCES.abcpFaq]}/>

                </ScrollView>
                </ScrollIntoViewContext.Provider>
                <ACFTBannerAd/>
            </Container>
        </SafeAreaView>
    );
}
