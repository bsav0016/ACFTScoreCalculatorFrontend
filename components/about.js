import { StyleSheet, Text, View, ImageBackground, Dimensions, SafeAreaView, Linking } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ACFTBannerAd from './ACFTBannerAd';

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
       <View style={styles.container}>
        <Text style={styles.headerText}>Thank you for choosing my app!</Text>
        <Text style={styles.bodyText}>If you have any feedback, comments, or suggestions 
        please reach out to me at the email address below, and I will do my best to get back to you ASAP. 
        This app is designed to make it easier for members of the Army to calculate their ACFT scores
        and track progress. As I mentioned in the "Profile" section, if you know me and would like your
        fee waived for saving scores, please reach out to me directly. Good luck to all, and I hope
        everyone can increase their scores!</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.bodyText}>Email: </Text>
          <TouchableOpacity onPress={() => openEmail()}>
            <Text style={styles.buttonText}>savidgeapps@gmail.com</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => openPrivacy()}>
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openTerms()}>
          <Text style={styles.buttonText}>Terms and Conditions</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    padding: 5,
    color: '#fff',
    backgroundColor: '#000'
  },
  bodyText:{
    fontSize: 16,
    padding: 5,
    color: '#fff',
    backgroundColor: '#000'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: '#000'
  },
  buttonText: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#FEC029',
    textDecorationLine: 'underline',
    backgroundColor: '#000',
    paddingHorizontal: 5
  }
});