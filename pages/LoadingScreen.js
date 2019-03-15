import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Animated, Linking} from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import {performLogin, setUserToken} from '../redux/actions/userActions.js';
import {AsyncStorage} from 'react-native';
import { setNavigator } from '../redux/actions/navActions.js';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#c8e6c9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Loading extends Component {

  constructor(){
    super();

  }

  componentDidMount(){
    // Remove the listener when you are done
    this.checkIfLoggedIn();
    this.props.setNavigator(this.props.navigation);
  }

  checkIfLoggedIn = () => {
    var firstTime = AsyncStorage.getItem('firstOpen');
    firstTime.then(res => {
      console.log(res);
      if (res !== null && res !== undefined) {
        var cachedToken = AsyncStorage.getItem('userToken');
        cachedToken.then(tok => {
          console.log(tok);
          if (tok !== null && tok !== undefined && tok !== '') {
            this.props.setUserToken(tok);
            Linking.getInitialURL().then((url) => {
              if (url) {
                const route = url.replace(/.*?:\/\//g, '');
                const id = route.match(/\/([^\/]+)\/?$/)[1];
                const data = {pad_id: id};
                console.log(id);
                this.props.navigation.navigate('QuickPad', data);
              }else{
                this.props.navigation.navigate('App');
              }
            }).catch(err => console.error('An error occurred', err));
          }else{
            Linking.getInitialURL().then((url) => {
              if (url) {
                const route = url.replace(/.*?:\/\//g, '');
                const id = route.match(/\/([^\/]+)\/?$/)[1];
                const data = {pad_id: id};
                console.log(id);
                this.props.navigation.navigate('QuickPad', data);
              }else{
                this.props.navigation.navigate('Auth');
              }
            }).catch(err => console.error('An error occurred', err));
          }
        });
      }else{
        this.props.navigation.navigate('AppIntro');
      }
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}></Text>
        </View>
    );
    this.didBlurHome.remove();
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
});

export default connect(mapStateToProps, { setUserToken, setNavigator })(Loading);
