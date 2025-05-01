import { Text, View, SafeAreaView, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ACFTBannerAd from '../ACFTBannerAd';
import aboutStyles from './aboutStyles';

export default function About() {

  const openPrivacy = () => {
    Linking.openURL('https://frameonapp.weebly.com/updated-acft-score-calculator-privacy-policy.html')
  }

  const openTerms = () => {
    Linking.openURL('https://frameonapp.weebly.com/updated-acft-score-calculator-terms-and-conditions.html')
  }

  const openEmail = () => {
    Linking.openURL('mailto:savidgeapps@gmail.com')
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
       <View style={aboutStyles.container}>
        <Text style={aboutStyles.headerText}>Thank you for choosing my app!</Text>
        <Text style={aboutStyles.bodyText}>
          If you have any feedback, comments, or suggestions please reach out to me at the email below, and I will do my best to get back to you ASAP. 
        </Text>
        <View style={aboutStyles.rowContainer}>
          <Text style={aboutStyles.bodyText}>Email: </Text>
          <TouchableOpacity onPress={() => openEmail()}>
            <Text style={aboutStyles.buttonText}>savidgeapps@gmail.com</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => openPrivacy()}>
          <Text style={aboutStyles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openTerms()}>
          <Text style={aboutStyles.buttonText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}

About.navigationOptions = screenProps => ({
  title: "About & Contact",
  headerStyle: {
      backgroundColor: '#FEC029'
  },
  headerTintColor: '#000',
  headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
      color: '#000'
  },
  backgroundColor: '#000'
})