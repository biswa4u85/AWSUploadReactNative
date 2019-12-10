import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import VerficationPage from './Pages/VerficationPage'
import ListPage from './Pages/ListPage'
import AddPage from './Pages/AddPage'

const RootStack = createStackNavigator({
  LoginPage: { screen: LoginPage },
  SignupPage: { screen: SignupPage },
  VerficationPage: { screen: VerficationPage },
  ListPage: { screen: ListPage },
  AddPage: { screen: AddPage },
},
  {
    initialRouteName: 'LoginPage',
    // initialRouteName: 'AddPage',
  });

const App = createAppContainer(RootStack);

export default App;