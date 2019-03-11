import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Animated} from 'react-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import {performLogin, setUserToken} from '../redux/actions/userActions.js';
import {AsyncStorage} from 'react-native';


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
    this.checkIfLoggedIn();
  }

  componentDidMount(){
    // Remove the listener when you are done
  }

  checkIfLoggedIn = () => {
    var cachedToken = AsyncStorage.getItem('userToken');
    cachedToken.then(tok => {
      console.log(tok);
      if (tok !== null && tok !== undefined && tok !== '') {
        this.props.setUserToken(tok);
        this.props.navigation.navigate('App');
      }else{
        // this.props.navigation.navigate('Auth');
        this.props.navigation.navigate('QuickPad');
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

export default connect(mapStateToProps, { setUserToken })(Loading);
