import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import ACFTBannerAd from '../ACFTBannerAd';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuItem, SectionLabel } from '../ui';
import { colors, font, space } from '../theme';
import { standardsLine } from '../Calculator/standards';


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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <ScrollView contentContainerStyle={{padding: space.lg, paddingBottom: space.xl}}>
        <SectionLabel style={{marginTop: space.sm}}>Current standards</SectionLabel>
        <MenuItem
          title="AFT Calculator"
          subtitle="Army Fitness Test scoring and how you rank"
          onPress={() => props.navigation.navigate("AFTCalculator")}
        />
        <MenuItem
          title="Waist-to-Height Ratio"
          subtitle="Body composition screening"
          onPress={() => props.navigation.navigate("WaistToHeightRatio")}
        />

        <SectionLabel style={{marginTop: space.xl}}>Historical standards</SectionLabel>
        <MenuItem
          title="ACFT Calculator"
          subtitle="Army Combat Fitness Test scoring"
          onPress={() => props.navigation.navigate("ACFTCalculator")}
        />
        <MenuItem
          title="H/W & Body Fat %"
          subtitle="Height, weight and tape-test body fat"
          onPress={() => props.navigation.navigate("BodyFatCalculator")}
        />

        <SectionLabel style={{marginTop: space.xl}}>More</SectionLabel>
        <MenuItem
          title="User Account"
          subtitle="Sign in and view saved scores"
          onPress={clickProfile}
        />
        <MenuItem title="About" onPress={() => props.navigation.navigate("About")} />

        <Text style={[font.caption, {textAlign: 'center', marginTop: space.xl}]}>{standardsLine()}</Text>
      </ScrollView>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}
