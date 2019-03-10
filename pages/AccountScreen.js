import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Animated, Image, KeyboardAvoidingView} from 'react-native';
import { USER_URL, USER_AUTH_URL, USER_PASS_CHANGE_URL } from '../redux/listrUrls.js';
import { connect } from 'react-redux';
import { FAB, Card, Appbar, TextInput, Button, Surface, Title, Headline} from 'react-native-paper';
import {performLogin} from '../redux/actions/userActions.js';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';
import { noFAB } from '../redux/actions/navActions.js';
import { getUserData, performPassChange, performNameChange } from '../redux/actions/userActions.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c8e6c9',
  },
  surface: {
    padding: 16,
    elevation: 2,
    borderRadius: 10,
    marginBottom: 10,

  },
  backgroundImage: {
    resizeMode: 'cover'
  }
});

class AccountScreen extends Component {
  constructor(){
    super();
    this.state = {
      newUsername: '',
      confirmUsername: '',
      newPassword: '',
      confirmPassword: ''
    }
    this._visibility = new Animated.Value(0);
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  componentDidMount(){
    this.props.noFAB();
    if(this.props.token !== null && this.props.token !== undefined){
      this.props.getUserData(USER_URL, this.props.token);
    }
  }

  componentDidUpdate(){
    if(this.props.token !== null && this.props.token !== undefined){
      this.props.getUserData(USER_URL, this.props.token);
    }else{
      this.props.navigation.navigate('Auth');
    }
  }

  handleNameChange = () => {
    if(this.state.newUsername == this.state.confirmUsername){
      this.props.performNameChange(USER_AUTH_URL, {"username": this.state.newUsername}, this.props.token);
      this.setState({newUsername: '',
      confirmUsername: '',
      newPassword: '',
      confirmPassword: ''});
    }
  }

  handlePassChange = () => {
    if(this.state.newPassword == this.state.confirmPassword){
      this.props.performPassChange(USER_PASS_CHANGE_URL, {"new_password1": this.state.newPassword, "new_password2": this.state.confirmPassword}, this.props.token);
      this.setState({newUsername: '',
      confirmUsername: '',
      newPassword: '',
      confirmPassword: ''});
    }
  }

  render() {
    return (
        <View behavior="padding" style={styles.container} enabled>
          <View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Headline style={{marginBottom: 10}}>My Account: {this.props.username}</Headline>
          </View>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <Surface style={styles.surface}>
              <Title>Change Username</Title>
              <TextInput
                 onSubmitEditing={() => { this.confirmUsername.focus(); }}
                 label='New Username'
                 mode='outlined'
                 value={this.state.newUsername}
                 onChangeText={newUsername => this.setState({ newUsername })}
                 style={{marginBottom: 10, backgroundColor: 'white'}}
                 autoCapitalize='none'
               />
               <TextInput
                ref={(input) => { this.confirmUsername = input; }}
                label='Confirm Username'
                mode='outlined'
                value={this.state.confirmUsername}
                onChangeText={confirmUsername => this.setState({ confirmUsername })}
                style={{marginBottom: 10, backgroundColor: 'white'}}
                returnKeyType='done'
                autoCapitalize='none'
              />
              <Button onPress={() => this.handleNameChange()}>Change</Button>
            </Surface>

              <KeyboardAvoidingView behavior="padding">
            <Surface style={styles.surface}>
              <Title>Change Password</Title>
              <TextInput
                 onSubmitEditing={() => { this.confirmPassword.focus(); }}
                 label='New Password'
                 mode='outlined'
                 value={this.state.newPassword}
                 onChangeText={newPassword => this.setState({ newPassword })}
                 style={{marginBottom: 10, backgroundColor: 'white'}}
                 secureTextEntry
                 autoCapitalize='none'
               />
               <TextInput
                ref={(input) => { this.confirmPassword= input; }}
                label='Confirm Password'
                mode='outlined'
                value={this.state.confirmPassword}
                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                style={{marginBottom: 10, backgroundColor: 'white'}}
                secureTextEntry
                returnKeyType='done'
                autoCapitalize='none'
              />
            <Button onPress={() => this.handlePassChange()}>Change</Button>
            </Surface>

            </KeyboardAvoidingView>
          </View>
        </View>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token,
  username: state.users.username
});

export default connect(mapStateToProps, { noFAB, getUserData, performNameChange, performPassChange })(AccountScreen);
