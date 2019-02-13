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
import {performLogin, setUserToken} from './redux/actions/userActions.js';
import {AsyncStorage} from 'react-native';

const styles = StyleSheet.create({});

const AppNavigator =

createRootNavigator = (load) => {
  return createStackNavigator({
    Home: HomeScreen,
    Details: Detail,
    Login: Login
  }, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    },
    initialRouteName: load
  });
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialScreen: 'Login'
    }
    this.appContainer = null;
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
  }

  componentWillMount() {
    this.checkIfLoggedIn();
    this.appContainer = createAppContainer(createRootNavigator(this.state.initialScreen));
  }

  checkIfLoggedIn() {
    var cachedToken = AsyncStorage.getItem('userToken');
    cachedToken.then(tok => {
      console.log(tok);
      if (tok !== null && tok !== undefined && tok !== '') {
        this.props.setUserToken(tok);
        this.setState({initialScreen: 'Home'});
        return true;
      }else{
        this.setState({initialScreen: 'Login'});
        return false;
      }
    });
  }

  render() {
    return (<View style={{
        flex: 1
      }}>
      <this.appContainer/>

    </View>);
  }
}

const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, {setUserToken})(App);
