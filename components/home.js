import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import ACFTBannerAd from './ACFTBannerAd';



export default function Home(props) {

  const { granted } = requestTrackingPermissionsAsync()

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>

        <View style={styles.container}>
      
        <TouchableOpacity onPress={() => props.navigation.navigate("BasicCalculator")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Calculate Score</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate("Auth")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate("About")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>About</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 6,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#000',
    margin: 10,
    borderColor: '#FEC029',
    borderWidth: 3
  },
  buttonText: {
    color: '#FEC029',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 24,
    textAlign: 'center'
  }
});
