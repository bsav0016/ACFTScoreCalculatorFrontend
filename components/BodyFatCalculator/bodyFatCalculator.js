import { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import ACFTBannerAd from "../ACFTBannerAd";
import { maleBodyFatCalculations } from "./maleBodyFatCalculations";
import { femaleBodyFatCalculations } from "./femaleBodyFatCalculations";

export default function BodyFatCalculator() {
    const [isMale, setIsMale] = useState(true);
    const [waistSize, setWaistSize] = useState('');
    const [weight, setWeight] = useState('');
    const [bodyFatPercent, setBodyFatPercent] = useState('');


    useEffect(() => {
        calculateBodyFatPercent();
    }, [isMale, waistSize, weight]);

    const calculateBodyFatPercent = () => {
        try {
            if (isMale) {
                const newBodyFatPercent = maleBodyFatCalculations[weight][waistSize];
                setBodyFatPercent(newBodyFatPercent);
            } else {
                const newBodyFatPercent = femaleBodyFatCalculations[weight][waistSize];
                setBodyFatPercent(newBodyFatPercent);
            }
        } catch {
            setBodyFatPercent('[Enter valid parameters]')
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <View>

            </View>
            <ACFTBannerAd/>
        </SafeAreaView>
    );
}