import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, Text } from 'react-native';

const ACFTBannerAd = () => {
  const unitID = Platform.select({
    ios: "ca-app-pub-3407478259803394/2116145800",
    android: "ca-app-pub-3407478259803394/2138582137",
  });

  return (
    <BannerAd
      unitId={TestIds.BANNER}
      //unitId={unitID}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  )
  /*return (
    <View style={{backgroundColor: '#5e3'}}>
      <Text style={{color: '#b36'}}>Please Display</Text>
    </View>
  )*/
}
 
export default ACFTBannerAd;