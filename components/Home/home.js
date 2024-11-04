import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import ACFTBannerAd from '../ACFTBannerAd';
import AsyncStorage from "@react-native-async-storage/async-storage";
import homeStyles from './homeStyles';


export default function Home(props) {
  requestTrackingPermissionsAsync()

  const navigateLogin = () => {
    props.navigation.navigate("Auth")
  }

  const navigateProfile = () => {
    props.navigation.navigate("Profile")
  }

  const clickProfile = async () => {
    const token = await AsyncStorage.getItem('MR_token');
    if (token) {
      navigateProfile()
    } else {
      navigateLogin()
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={homeStyles.container}>
        <TouchableOpacity onPress={() => props.navigation.navigate("BasicCalculator")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>Calculate Score</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickProfile}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("About")}>
          <View style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>About</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}

Home.navigationOptions = screenProps => ({
  title: "Home",
  headerStyle: {
      backgroundColor: '#FEC029'
  },
  headerTintColor: '#000',
  headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#000'
  },
  headerLeft: () => null
})
