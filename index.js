import { registerRootComponent } from 'expo';
import 'expo-asset'

import App from './App';
import { initErrorReporting, wrapApp } from './components/errorReporting';

initErrorReporting();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(wrapApp(App));
