import BasicCalculator from './components/Calculator/basic_calculator';
import Profile from './components/Profile/profile';
import About from './components/About/about';
import Auth from './components/Auth/auth';
import Home from './components/Home/home';
import ACFTResults from './components/AcftResults/acft_results';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


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