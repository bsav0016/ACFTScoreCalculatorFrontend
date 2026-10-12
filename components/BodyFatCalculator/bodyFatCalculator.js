import { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import ACFTBannerAd from "../ACFTBannerAd";
import { maleBodyFatCalculations } from "./CalculationDicts/maleBodyFatCalculations";
import { femaleBodyFatCalculations } from "./CalculationDicts/femaleBodyFatCalculations";
import { maleHeightWeightCalculations } from "./CalculationDicts/maleHeightWeightCalculations";
import { femaleHeightWeightCalculations } from "./CalculationDicts/femaleHeightWeightCalculations";
import { Card, ChartModal, Field, ResultRow, ScrollIntoViewContext, SectionLabel, Segmented, useKeepFocusedVisible } from '../ui';
import { colors, font, space } from '../theme';

export default function BodyFatCalculator(props) {
    const invalidParameters = "[Invalid input]"
    const [isMale, setIsMale] = useState(true);
    const [waistSize, setWaistSize] = useState('');
    const [weight, setWeight] = useState('');
    const [bodyFatPercent, setBodyFatPercent] = useState('');
    const [displayValidParameters, setDisplayValidParameters] = useState(false);
    const [displayHWValidParameters, setDisplayHWValidParameters] = useState(false);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [maxWeight, setMaxWeight] = useState(invalidParameters);
    const [minWeight, setMinWeight] = useState(invalidParameters);

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    
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

    useEffect(() => {
        calculateBodyFatPercent();
    }, [isMale, waistSize, weight]);

    useEffect(() => {
        calculateWeights();
    }, [isMale, age, height]);

    const calculateBodyFatPercent = () => {
        try {
            const parsedWeight = parseInt(weight);
            const parsedWaist = parseInt(waistSize);
            const newBodyFatPercent = isMale ? maleBodyFatCalculations[parsedWeight][parsedWaist]
                : femaleBodyFatCalculations[parsedWeight][parsedWaist]
            if (!newBodyFatPercent) {
                throw new Error('Invalid inputs');
            }
            setBodyFatPercent(newBodyFatPercent + '%');
        } catch {
            setBodyFatPercent(invalidParameters);
        }
    }

    const calculateWeights = () => {
        try {
            const parsedAge = parseInt(age);
            const maxAge = parsedAge <= 20 ? 20
                : parsedAge <= 27 ? 27
                : parsedAge <= 39 ? 39
                : 99
            const parsedHeight = parseInt(height);
            const newMinWeight = isMale ? maleHeightWeightCalculations[parsedHeight][0]
                : femaleHeightWeightCalculations[parsedHeight][0];
            const newMaxWeight = isMale ? maleHeightWeightCalculations[parsedHeight][maxAge]
                : femaleHeightWeightCalculations[parsedHeight][maxAge]
            if (!newMinWeight || !newMaxWeight) {
                throw new Error('Invalid parameters');
            }
            setMinWeight(newMinWeight);
            setMaxWeight(newMaxWeight);
        } catch {
            setMinWeight(invalidParameters);
            setMaxWeight(invalidParameters);
        }
    }

    const { scrollProps, ensureVisible } = useKeepFocusedVisible();
    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const show = (value) => (value === invalidParameters || value === '' ? '—' : value)
    const infoLink = (onPress) => (
        <TouchableOpacity onPress={onPress} style={{paddingTop: space.md}}>
            <Text style={{color: colors.gold, fontSize: 14}}>What inputs are valid?</Text>
        </TouchableOpacity>
    )

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
                        <Field label="Age" value={age} onChangeText={setAge} placeholder="17-99"
                            onSubmitEditing={() => heightRef.current.focus()}/>
                        <Field label="Height (in)" value={height} onChangeText={setHeight} placeholder="58-80"
                            inputRef={heightRef} onSubmitEditing={() => weightRef.current.focus()}/>
                        <ResultRow label="Min weight" value={show(minWeight)}/>
                        <ResultRow label="Max weight" value={show(maxWeight)}/>
                        {minWeight === invalidParameters && infoLink(() => setDisplayHWValidParameters(true))}
                    </Card>

                    <Card>
                        <Text style={font.heading}>Body fat %</Text>
                        <Field label="Weight (lbs)" value={weight} onChangeText={setWeight} placeholder="90-250"
                            inputRef={weightRef} onSubmitEditing={() => waistRef.current.focus()}/>
                        <Field label="Waist (in)" value={waistSize} onChangeText={setWaistSize} placeholder="25-55"
                            inputRef={waistRef} returnKeyType="done"/>
                        <ResultRow label="Body fat" value={show(bodyFatPercent)} large/>
                        {bodyFatPercent === invalidParameters && infoLink(() => setDisplayValidParameters(true))}
                    </Card>

                    <ChartModal visible={displayHWValidParameters} onClose={() => setDisplayHWValidParameters(false)}>
                        <Text style={font.body}>Age must be a whole number between 1 and 99. Height must be a whole number between 58 (60 for males) and 80.</Text>
                    </ChartModal>
                    <ChartModal visible={displayValidParameters} onClose={() => setDisplayValidParameters(false)}>
                        <Text style={font.body}>Waist size must be a whole number or end in .5 and be between 25 and 55. Weight must be a whole number between 90 and 250.</Text>
                    </ChartModal>
                </ScrollView>
                </ScrollIntoViewContext.Provider>
                <ACFTBannerAd/>
            </Container>
        </SafeAreaView>
    );
}
