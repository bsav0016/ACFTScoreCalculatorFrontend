import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from './components/Profile/profile';
import About from './components/About/about';
import Auth from './components/Auth/auth';
import Home from './components/Home/home';
import ACFTResults from './components/AcftResults/acft_results';
import BodyFatCalculator from './components/BodyFatCalculator/bodyFatCalculator';
import WaistToHeightRatio from './components/WaistToHeightRatio/waistToHeightRatio';
import AFTCalculator from './components/Calculator/aftCalculator';
import AFTPlanner from './components/Calculator/AFTPlanner';
import ACFTCalculator from './components/ACFTCalculator/ACFTCalculator';
import { colors, headerOptions } from './components/theme';

const Stack = createNativeStackNavigator();

// On tablets the phone-shaped screens would stretch edge to edge, so keep them to a readable column.
const MAX_CONTENT_WIDTH = 640;
const screenLayout = ({ children }) => (
  <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.bg }}>
    <View style={{ flex: 1, width: '100%', maxWidth: MAX_CONTENT_WIDTH }}>{children}</View>
  </View>
);

export default function App() {
  return (
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg } }}>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={headerOptions}
        screenLayout={screenLayout}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: "Home" }}/>
        <Stack.Screen name="AFTCalculator" component={AFTCalculator} options={{ title: "AFT Calculator" }}/>
        <Stack.Screen name="AFTPlanner" component={AFTPlanner} options={{ title: "Goal Planner" }}/>
        <Stack.Screen name="ACFTCalculator" component={ACFTCalculator} options={{ title: "ACFT Calculator" }}/>
        <Stack.Screen name="BodyFatCalculator" component={BodyFatCalculator} options={{ title: "H&W & Body Fat %" }} />
        <Stack.Screen name="WaistToHeightRatio" component={WaistToHeightRatio} options={{ title: "Waist-to-Height Ratio" }} />
        <Stack.Screen name="Auth" component={Auth} options={{ title: "Login" }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }}/>
        <Stack.Screen name="About" component={About} options={{ title: "About" }} />
        <Stack.Screen name="ACFTResults" component={ACFTResults} options={{ title: "Saved Results" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
