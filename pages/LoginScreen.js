import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Animated, Image, KeyboardAvoidingView} from 'react-native';
import { LOGIN_URL, QUICK_URL} from '../redux/listrUrls.js';
import { connect } from 'react-redux';
import { FAB, Card, Appbar, TextInput, Button, Headline} from 'react-native-paper';
import {performLogin} from '../redux/actions/userActions.js';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';
import { noFAB } from '../redux/actions/navActions.js';

const GUEST_KEY = 'd0b7b2803369922e5e8e2716ec4f296b2f224bed'; //PRODUCTION
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    flex: 2,
    padding: 20
  },
  login__input: {
    backgroundColor: '#c8e6c9',
    borderColor: 'red',
    marginBottom: 10
  },
  login__button: {
    marginTop: 5,
    borderRadius: 5,
  }
});

class Login extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
    this._visibility = new Animated.Value(0);
  }

  userLogin = () => {
    if(this.state.username !== '' && this.state.password !== ''){
      const userData = {
        username: this.state.username,
        password: this.state.password
      }
      this.props.performLogin(LOGIN_URL, userData);
    }
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
  }
  componentDidMount(){
    this.props.noFAB();

  }

  componentDidUpdate(){
    this.props.noFAB();
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){
      this.props.navigation.navigate('App');
    }
  }

  createQuickPad = () => {
      fetch(QUICK_URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Token ' + GUEST_KEY
        },
      })
      .then(res => {
        if(res.status === 200){
          return res.json();
        }else{
          console.log(res.json().detail);
        }
      }).then(data => {
        this.props.navigation.navigate('QuickPad', data);
      });
    }

  render() {
    const containerStyle = {
      flex: 1,
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };
    var padding = Platform.OS === 'ios' ? 'padding' : 'none';
    return (
        <KeyboardAvoidingView style={styles.container} behavior={padding} enabled>
          <Animated.View style={containerStyle}>
            <View style={{flex: 1}}>
              <Image
                style={[styles.backgroundImage,
                   {flex: 1,
                    alignSelf: 'center',
                    width: 250,
                    height: 250}]}
                source={require('../assets/ImageBG.png')}
                resizeMode="contain"
              />
            </View>
          <View style={styles.form}>
            <Button style={[styles.login__button, {alignSelf: 'center'}]} mode='contained' onPress={() => this.createQuickPad()}>
              Create QuickPad
            </Button>
            <Headline style={{alignSelf: 'center', marginTop: 16, marginBottom: 16}}>or</Headline>
            <View>
              <TextInput
                style={styles.login__input}
                label='Username'
                mode="outlined"
                autoCapitalize='none'
                value={this.state.username}
                onChangeText={text => this.setState({username: text})}
                onSubmitEditing={() => { this.secondTextInput.focus(); }}
              />
            </View>
            <View>
              <TextInput
                style={styles.login__input}
                label='Password'
                mode="outlined"
                value={this.state.password}
                secureTextEntry
                autoCapitalize='none'
                onChangeText={text => this.setState({password: text })}
                ref={(input) => { this.secondTextInput = input; }}
              />
            </View>
          <Button style={styles.login__button} mode="contained" onPress={() => this.userLogin()}>
              Login
            </Button>
            <Button style={styles.login__button} onPress={() => this.props.navigation.navigate('Register')}>
              Create Account
            </Button>
          </View>
        </Animated.View>
        </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { performLogin, noFAB })(Login);
