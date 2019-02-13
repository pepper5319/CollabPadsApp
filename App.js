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
import { Appbar } from 'react-native-paper';
import HomeScreen from './pages/HomeScreen.js';
import Detail from './pages/Detail.js';

const styles = StyleSheet.create({

});

const AppNavigator = createStackNavigator(
  {
  Home: HomeScreen,
  Details: Detail
  },
  {
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      }
  });
const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  render() {
    return (
        <View style={{flex: 1}}>
          <AppContainer />

        </View>
      );
  }
}

const mapStateToProps = state => ({});


export default connect(mapStateToProps, {  })(App);
