import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Animated, Image, KeyboardAvoidingView, Linking} from 'react-native';
import { USER_URL, USER_AUTH_URL, USER_PASS_CHANGE_URL } from '../redux/listrUrls.js';
import { connect } from 'react-redux';
import { FAB, Card, Appbar, TextInput, Button, Surface, Title, Headline, Portal, Dialog, Paragraph} from 'react-native-paper';
import {performLogin, performLogout} from '../redux/actions/userActions.js';
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
  },
  header: {
    ...ifIphoneX({marginTop: 48, marginBottom: 32}, {marginTop: 16, marginBottom: 16})
  }
});

class AccountScreen extends Component {
  constructor(){
    super();
    this.state = {
      newUsername: '',
      confirmUsername: '',
      newPassword: '',
      confirmPassword: '',
      requestDelete: false,
      delUsername: '',
      canDelete: false
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

  requestDelete = () => {
    this.setState({requestDelete: true});
  }

  confirmUsername = (name) => {
    this.setState({delUsername: name});
    if(name === this.props.data.owner){
      this.setState({canDelete: true});
    }else{
      if(this.state.canDelete === true){
        this.setState({canDelete: false});
      }
    }
  }

  deleteUser = () => {
    fetch(USER_URL, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      }
    })
    .then( () => {
      this.props.performLogout(USER_URL);
    });
  }

  privacy = () => {

  }

  render() {
    return (
        <ScrollView style={styles.container} enabled>
          <View style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Headline style={styles.header}>My Account: {this.props.username}</Headline>
          </View>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <KeyboardAvoidingView behavior="position">
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
            <Button style={{marginTop: 10, marginBottom: 16}} color='red' mode="outlined" onPress={() => this.requestDelete()}>Delete Account</Button>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 16}}>
              <Button compact color='grey' onPress={() => Linking.openURL('https://app.termly.io/document/privacy-policy/43ccc625-28e6-4910-ae48-c0071babafa9').catch((err) => console.error('An error occurred', err))}>Privacy Policy</Button>
              <Button compact color='grey' onPress={() => Linking.openURL('https://www.collabpads.com/').catch((err) => console.error('An error occurred', err))}>Website</Button>
            </View>
          </View>
          {this.state.requestDelete === true &&
            <Portal>
            <Dialog
              visible={this.state.requestDelete}
              onDismiss={this._hideDialog}>
              <KeyboardAvoidingView>
              <Dialog.Content>
                <Dialog.Title>Are You Sure You Want to Delete Your Account?</Dialog.Title>
                <Paragraph style={{fontWeight: '500'}}>Type in your username to confirm</Paragraph>
                  <TextInput
                    value={this.state.delUsername}
                    mode='outlined'
                    error={!this.state.canDelete}
                    onChangeText={delUsername => this.confirmUsername(delUsername)}
                    autoCapitalize='none'
                    onSubmitEditing={() => this.deletePad(this.props.data.static_id)}
                    returnKeyType='done'
                    style={{marginBottom: 10}}
                  />
              </Dialog.Content>
              </KeyboardAvoidingView>
            </Dialog>
          </Portal>
          }
        </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token,
  username: state.users.username
});

export default connect(mapStateToProps, { noFAB, getUserData, performNameChange, performPassChange, performLogout })(AccountScreen);
