import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import ACFTBannerAd from '../ACFTBannerAd';
import AsyncStorage from "@react-native-async-storage/async-storage";
import homeStyles from './homeStyles';


export default function Home(props) {
  requestTrackingPermissionsAsync()

  const navigateLogin = () => {
    props.navigation.navigate("Auth");
  }

  const navigateProfile = () => {
    props.navigation.navigate("Profile");
  }

  const clickProfile = async () => {
    const token = await AsyncStorage.getItem('MR_token');
    if (token) {
      navigateProfile();
    } else {
      navigateLogin();
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={homeStyles.container}>
        <TouchableOpacity onPress={() => props.navigation.navigate("AFTCalculator")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>AFT Calculator</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("ACFTCalculator")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>ACFT Calculator</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("BodyFatCalculator")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>H/W & Body Fat %</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickProfile}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>User Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("About")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>About</Text>
          </View>
        </TouchableOpacity>
        
      </View>
      <View style={homeStyles.caoContainer}>
        <Text style={homeStyles.caoText}>Current as of 1 May 2025</Text>
      </View>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}
