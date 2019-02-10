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
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from './pages/HomeScreen.js';


const AppNavigator = createStackNavigator({
  Home:HomeScreen
});
const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const mapStateToProps = state => ({});


export default connect(mapStateToProps, {  })(App);
