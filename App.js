/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from "react-navigation";
import {Appbar} from 'react-native-paper';
import HomeScreen from './pages/HomeScreen.js';
import Detail from './pages/Detail.js';
import Login from './pages/LoginScreen.js';
import Loading from './pages/LoadingScreen.js';
import NewPadScreen from './pages/NewPadScreen.js';
import {AsyncStorage} from 'react-native';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { fromLeft, fadeIn, fromRight } from 'react-navigation-transitions'

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'Details') {
    return fromRight();
  } else if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'NewPad') {
    return fadeIn();
  }
  return fromLeft();
}

const styles = StyleSheet.create({});

  const MainStack = createStackNavigator(
    {
      Home: HomeScreen,
      Details: Detail,
      NewPad: NewPadScreen
    }, {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false
      },
      initialRouteName: 'Home',
      gesturesEnabled: true,
      mode: 'card',
      transitionConfig: (nav) => handleCustomTransition(nav)
    }
  );

  const AuthStack = createStackNavigator(
    {
      Login: Login
    }, {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false
      },
      initialRouteName: 'Login'
    }
  );

  const AppNavigator = createSwitchNavigator(
    {
      Loading: Loading,
      Auth: AuthStack,
      App: MainStack
    },{
      initialRouteName: 'Loading'
    }
  );
  const AppContainer = createAppContainer(AppNavigator);


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialScreen: 'Login'
    }
    this.appContainer = null
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
      </View>);
  }
}

const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, {})(App);
