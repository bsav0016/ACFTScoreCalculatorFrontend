import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from './components/Profile/profile';
import About from './components/About/about';
import Auth from './components/Auth/auth';
import Home from './components/Home/home';
import ACFTResults from './components/AcftResults/acft_results';
import BodyFatCalculator from './components/BodyFatCalculator/bodyFatCalculator';
import AFTCalculator from './components/Calculator/aftCalculator';
import ACFTCalculator from './components/ACFTCalculator/ACFTCalculator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
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
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: "Home" }}/>
        <Stack.Screen name="AFTCalculator" component={AFTCalculator} options={{ title: "AFT Calculator" }}/>
        <Stack.Screen name="ACFTCalculator" component={ACFTCalculator} options={{ title: "ACFT Calculator" }}/>
        <Stack.Screen name="BodyFatCalculator" component={BodyFatCalculator} options={{ title: "H&W & Body Fat %" }} />
        <Stack.Screen name="Auth" component={Auth} options={{ title: "Login" }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }}/>
        <Stack.Screen name="About" component={About} options={{ title: "About" }} />
        <Stack.Screen name="ACFTResults" component={ACFTResults} options={{ title: "Saved Results" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
