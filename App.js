import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as firebase from './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import Styles from './components/util/Styles';

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    };
  }

  componentDidMount() {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        });
      }
    }); 
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            size={'large'}
            color={'blue'}
          />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Landing'>
            <Stack.Screen
              name='Landing'
              component={LandingScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name='Register'
              component={RegisterScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen 
              name={'Main'} 
              component={MainScreen} 
              // options={{ headerShown: false}}
            />
            <Stack.Screen 
              name={'Add'} 
              component={AddScreen} 
            />
            <Stack.Screen 
              name={'Save'} 
              component={SaveScreen} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}