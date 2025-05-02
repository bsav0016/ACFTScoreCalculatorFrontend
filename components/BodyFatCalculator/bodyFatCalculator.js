import { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, TextInput, Modal, ScrollView, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import ACFTBannerAd from "../ACFTBannerAd";
import { maleBodyFatCalculations } from "./CalculationDicts/maleBodyFatCalculations";
import { femaleBodyFatCalculations } from "./CalculationDicts/femaleBodyFatCalculations";
import { maleHeightWeightCalculations } from "./CalculationDicts/maleHeightWeightCalculations";
import { femaleHeightWeightCalculations } from "./CalculationDicts/femaleHeightWeightCalculations";
import { bodyFatCalculatorStyles } from './bodyFatCalculatorStyles';

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

    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Container style={bodyFatCalculatorStyles.container1}
                    behavior="padding">
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardDismissMode='none'>

                    <View style={[bodyFatCalculatorStyles.maleFemaleContainer, {marginTop: keyboardOpen ? 10 : 25}]}>
                        <TouchableOpacity 
                            onPress={() => setIsMale(true)}
                            style={isMale ? bodyFatCalculatorStyles.maleFemaleSelectedContainer : bodyFatCalculatorStyles.maleFemaleUnselectedContainer}
                        >
                            <Text style={isMale ? bodyFatCalculatorStyles.maleFemaleTextSelected : bodyFatCalculatorStyles.maleFemaleTextUnselected}>
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsMale(false)}
                            style={isMale ? bodyFatCalculatorStyles.maleFemaleUnselectedContainer : bodyFatCalculatorStyles.maleFemaleSelectedContainer}
                        >
                            <Text style={isMale ? bodyFatCalculatorStyles.maleFemaleTextUnselected : bodyFatCalculatorStyles.maleFemaleTextSelected}>
                                Female
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={bodyFatCalculatorStyles.headerText}>Height & Weight Acceptable Range</Text>

                    <View style={bodyFatCalculatorStyles.fieldContainer}>
                        <Text style={bodyFatCalculatorStyles.fieldText}>Age: </Text>
                        <TextInput
                            value={age}
                            keyboardType='numeric'
                            returnKeyType='next'
                            style={bodyFatCalculatorStyles.input}
                            placeholder={"17-99"}
                            placeholderTextColor='gray'
                            onChangeText={setAge}
                            onSubmitEditing={() => heightRef.current.focus()}
                        />
                    </View>

                    <View style={bodyFatCalculatorStyles.fieldContainer}>
                        <Text style={bodyFatCalculatorStyles.fieldText}>Height: </Text>
                        <TextInput
                            value={height}
                            ref={heightRef}
                            keyboardType='numeric'
                            returnKeyType='done'
                            style={bodyFatCalculatorStyles.input}
                            placeholder={"58-80"}
                            placeholderTextColor='gray'
                            onChangeText={setHeight}
                        />
                    </View>

                    <View style={bodyFatCalculatorStyles.descriptionContainer}>
                        <Text style={bodyFatCalculatorStyles.descriptionText}>
                            Min Weight: {minWeight}
                        </Text>

                        <View style={bodyFatCalculatorStyles.rowContainer}>
                            <Text style={bodyFatCalculatorStyles.descriptionText}>
                                Max Weight: {maxWeight}
                            </Text>

                            {minWeight === invalidParameters &&
                                <TouchableOpacity onPress={() => setDisplayHWValidParameters(true)}>
                                    <Text>ℹ️</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        
                    </View>

                    <Modal
                        transparent={true}
                        visible={displayHWValidParameters}
                        onRequestClose={() => setDisplayHWValidParameters(false)}
                    >
                        <View style={bodyFatCalculatorStyles.parametersModalOverlay}>
                            <View style={bodyFatCalculatorStyles.parametersModalContent}>
                                <Text>Age must be a whole number beteen 1 and 99. Height must be a whole number between 58 (60 for males) and 80.</Text>
                                <TouchableOpacity style={bodyFatCalculatorStyles.button} onPress={() => setDisplayHWValidParameters(false)}>
                                    <Text style={bodyFatCalculatorStyles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>  

                    <Text style={bodyFatCalculatorStyles.headerText}>Body Fat % Calculator</Text>

                    <View style={bodyFatCalculatorStyles.fieldContainer}>
                        <Text style={bodyFatCalculatorStyles.fieldText}>Weight: </Text>
                        <TextInput
                            value={weight}
                            keyboardType='numeric'
                            returnKeyType='next'
                            style={bodyFatCalculatorStyles.input}
                            placeholder={"90-250"}
                            placeholderTextColor='gray'
                            onChangeText={setWeight}
                            onSubmitEditing={() => waistRef.current.focus()}
                        />
                    </View>

                    <View style={bodyFatCalculatorStyles.fieldContainer}>
                        <Text style={bodyFatCalculatorStyles.fieldText}>Waist Size: </Text>
                        <TextInput
                            value={waistSize}
                            ref={waistRef}
                            keyboardType='numeric'
                            returnKeyType='done'
                            style={bodyFatCalculatorStyles.input}
                            placeholder={"25-55 (0.5s)"}
                            placeholderTextColor='gray'
                            onChangeText={setWaistSize}
                        />
                    </View>

                    <View style={bodyFatCalculatorStyles.descriptionContainer}>
                        <View style={bodyFatCalculatorStyles.rowContainer}>
                            <Text style={bodyFatCalculatorStyles.descriptionText}>Body Fat: {bodyFatPercent}</Text>
                            {bodyFatPercent === invalidParameters &&
                                <TouchableOpacity onPress={() => setDisplayValidParameters(true)}>
                                    <Text>ℹ️</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <Modal
                        transparent={true}
                        visible={displayValidParameters}
                        onRequestClose={() => setDisplayValidParameters(false)}
                    >
                        <View style={bodyFatCalculatorStyles.parametersModalOverlay}>
                            <View style={bodyFatCalculatorStyles.parametersModalContent}>
                                <Text>Waist size must be a whole number or end in .5 and be between 25 and 55. Weight must be a whole number between 90 and 250.</Text>
                                <TouchableOpacity style={bodyFatCalculatorStyles.button} onPress={() => setDisplayValidParameters(false)}>
                                    <Text style={bodyFatCalculatorStyles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>         
                    
                
                    <ACFTBannerAd/>
                    </ScrollView>
                </Container>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

BodyFatCalculator.navigationOptions = screenProps => ({
    title: "Body Fat Calculator",
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