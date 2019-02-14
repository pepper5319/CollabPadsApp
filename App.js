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
import {createStackNavigator, createAppContainer} from "react-navigation";
import {Appbar} from 'react-native-paper';
import HomeScreen from './pages/HomeScreen.js';
import Detail from './pages/Detail.js';
import Login from './pages/LoginScreen.js';
import Loading from './pages/LoadingScreen.js';
import {AsyncStorage} from 'react-native';

const styles = StyleSheet.create({});


  const AppNavigator = createStackNavigator({
      Home: HomeScreen,
      Details: Detail,
      Login: Login,
      Loading: Loading
    }, {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false
      },
      initialRouteName: 'Loading'
    });
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
