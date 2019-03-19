import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Linking
} from 'react-native';
import {REGISTER_URL} from '../redux/listrUrls.js';
import {connect} from 'react-redux';
import {
  FAB,
  Card,
  Appbar,
  TextInput,
  Button,
  Headline,
  Portal,
  Dialog,
  ActivityIndicator,
  Colors,
  Switch,
  Paragraph
} from 'react-native-paper';
import {performRegister} from '../redux/actions/userActions.js';
import {ifIphoneX} from 'react-native-iphone-x-helper'
import {StackActions, NavigationActions} from 'react-navigation';
import {noFAB} from '../redux/actions/navActions.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9',
    padding: 16
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 32,
    justifyContent: 'center'
  },
  login__input: {
    backgroundColor: 'white',
    borderColor: 'red',
    marginBottom: 10
  },
  login__button: {
    borderRadius: 32,
  }
});

class RegisterScreen extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      password2: '',
      checked: false
    }
    this._visibility = new Animated.Value(0);
  }

  userRegister = () => {
    if(this.state.checked === true){
      if (this.state.username !== '' && this.state.password !== '' && this.state.password2 !== '') {
        const userData = {
          username: this.state.username,
          password1: this.state.password,
          password2: this.state.password2
        }
        this.props.performRegister(REGISTER_URL, userData);
        this.setState({username: '', password: '', password2: ''});
      } else {
        alert('You must fill out all fields');
      }
    }
  }

  componentWillMount() {
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300
    }).start();
  }

  componentDidUpdate() {
    this.props.noFAB();
    if (this.props.token !== null && this.props.token !== undefined && this.props.token !== '') {
      this.props.navigation.navigate('App');
    }
  }

  render() {
    const containerStyle = {
      flex: 1,
      opacity: this._visibility.interpolate({
        inputRange: [
          0, 1
        ],
        outputRange: [0, 1]
      })
    };
    return (<KeyboardAvoidingView style={styles.container} behavior="padding" enabled="enabled">
      <Animated.View style={containerStyle}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            style={[styles.backgroundImage,
               {borderRadius: 16,
                alignSelf: 'center',
                width: 150,
                height: 150,
              }]}
            source={require('../assets/logo.png')}
            resizeMode="contain"
          />
        </View>
        <Card style={styles.form} elevation={10}>
          <Card.Title title="Sign Up for CollabPads"/>
          <Card.Content>
          <TextInput style={styles.login__input} label='Username' mode="outlined" autoCapitalize='none' value={this.state.username} onChangeText={text => this.setState({username: text})} onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}/>
          <TextInput style={styles.login__input} label='Password' mode="outlined" value={this.state.password} secureTextEntry autoCapitalize='none' onChangeText={text => this.setState({password: text})} onSubmitEditing={() => {
              this.thirdTextInput.focus();
            }} ref={(input) => {
              this.secondTextInput = input;
            }}/>
          <TextInput style={styles.login__input} label='Confirm Password' mode="outlined" value={this.state.password2} secureTextEntry autoCapitalize='none' returnKeyType='done' onChangeText={text => this.setState({password2: text})} ref={(input) => {
              this.thirdTextInput = input;
            }}/>
          <View style={{flexDirection:'row', paddingRight: 32}}>
            <Switch
              style={{marginTop: 5, marginRight: 8}}
              value={this.state.checked}
              onValueChange={() => { this.setState({ checked: !this.state.checked }); }}
            />
          <TouchableOpacity onPress={() => Linking.openURL('https://app.termly.io/document/privacy-policy/43ccc625-28e6-4910-ae48-c0071babafa9').catch((err) => console.error('An error occurred', err))}>
              <Paragraph style={{paddingRight: 16, marginBottom: 16}}>
                I confirm that I am over the age of 13 and have read the <Text style={{textDecorationLine: 'underline'}}>Privacy Policy</Text>
              </Paragraph>
          </TouchableOpacity>
          </View>
          <Button style={styles.login__button} mode="contained" onPress={() => this.userRegister()}>
            Create Account
          </Button>
          <Button style={styles.login__button} onPress={() => this.props.navigation.goBack()}>
            Login
          </Button>
          </Card.Content>
        </Card>
      </Animated.View>
      <Portal>
        <Dialog visible={this.props.loading === true}>
          <Dialog.Title>Setting Up Your Account</Dialog.Title>
          <Dialog.Content>
            <ActivityIndicator animating={true} color={Colors.red800}/>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>);
  }
}
const mapStateToProps = state => ({token: state.users.token, loading: state.users.loading});

export default connect(mapStateToProps, {performRegister, noFAB})(RegisterScreen);
