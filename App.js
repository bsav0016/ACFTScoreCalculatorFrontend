import BasicCalculator from './components/basic_calculator';
import Profile from './components/profile';
import About from './components/about';
import Auth from './components/auth';
import Home from './components/home';
import ACFTResults from './components/acft_results';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

/*import mobileAds from 'react-native-google-mobile-ads';

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });*/

const AppNavigator = createStackNavigator({
  Home: {screen: Home},
  BasicCalculator: {screen: BasicCalculator},
  Auth: {screen: Auth},
  Profile: {screen: Profile},
  About: {screen: About},
  ACFTResults: {screen: ACFTResults}
})

const App = createAppContainer(AppNavigator)

export default App;