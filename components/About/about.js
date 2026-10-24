import { Text, SafeAreaView, ScrollView, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import ACFTBannerAd from '../ACFTBannerAd';
import Button from '../Button';
import { Card } from '../ui';
import { colors, font, space } from '../theme';
import { TABLE_VERSION } from '../Calculator/standards';
import { describeBuild } from '../buildLabel';

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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bg}}>
      <ScrollView contentContainerStyle={{padding: space.lg}}>
        <Card>
          <Text style={font.title}>Thank you for choosing my app!</Text>
          <Text style={[font.body, {marginTop: space.md, color: colors.textMuted, lineHeight: 22}]}>
            If you have any feedback, comments, or suggestions please reach out to me at the email below, and I will do my best to get back to you ASAP.
          </Text>
          <Button variant="text" title="savidgeapps@gmail.com" onPress={() => openEmail()} style={{alignSelf: 'flex-start', paddingHorizontal: 0, marginTop: space.sm}} />
        </Card>
        <Card>
          <Button variant="text" title="Privacy Policy" onPress={() => openPrivacy()} style={{alignSelf: 'flex-start', paddingHorizontal: 0}} />
          <Button variant="text" title="Terms and Conditions" onPress={() => openTerms()} style={{alignSelf: 'flex-start', paddingHorizontal: 0}} />
        </Card>
        <Text style={[font.caption, {textAlign: 'center', marginTop: space.md}]}>
          {describeBuild({
            appVersion: Constants.expoConfig?.version,
            tableVersion: TABLE_VERSION,
            updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
            updatesEnabled: Updates.isEnabled,
          })}
        </Text>
      </ScrollView>
      <ACFTBannerAd/>
    </SafeAreaView>
  );
}
