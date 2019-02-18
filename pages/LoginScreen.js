import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import { LOGIN_URL } from '../redux/listrUrls.js';
import { connect } from 'react-redux';
import { FAB, Card, Appbar, TextInput, Button, } from 'react-native-paper';
import {performLogin} from '../redux/actions/userActions.js';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';

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
    flex: 1,
    padding: 20
  },
  login__input: {
    backgroundColor: '#c8e6c9',
    borderColor: 'red',
    marginBottom: 10
  },
  login__button: {
    marginTop: 5,
    borderRadius: 10
  }
});

class Login extends Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
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

  componentDidUpdate(){
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){
      this.props.navigation.dispatch(StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                          NavigationActions.navigate({ routeName: 'Home'}),
                                                          NavigationActions.navigate({ routeName: 'Details'})
                                                        ]
                                                      }));
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
              <Text style={{fontSize: 20}}>{this.props.token}</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.login__input}
              label='Username'
              mode="outlined"
              autoCapitalize='none'
              value={this.state.username}
              onChangeText={text => this.setState({username: text})}
            />
            <TextInput
              style={styles.login__input}
              label='Password'
              mode="outlined"
              value={this.state.password}
              secureTextEntry
              autoCapitalize='none'
              onChangeText={text => this.setState({password: text })}
            />
          <Button style={styles.login__button} mode="contained" onPress={() => this.userLogin()}>
              Login
            </Button>
          </View>
        </View>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { performLogin })(Login);
