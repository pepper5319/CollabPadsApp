import React, { Component } from 'react';
import {Platform, StyleSheet, Image, Text, View, AsyncStorage, Dimensions, Animated, Easing, Linking} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

class AppIntro extends Component {

  completeOnboarding = async () => {
      await AsyncStorage.setItem('firstOpen', 'true');
      this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <Onboarding
        pages={[
          {
            backgroundColor: '#43a048',
            image: <Image style={{width: 350, height: 350}} source={require('../assets/onboarding1.png')} />,
            title: 'Welcome!',
            subtitle: 'Collabpads lets you create Pads (next level lists), for anytime a list is needed.',
          },{
            backgroundColor: '#43a048',
            image: <Image style={{width: 300, height: 300}} source={require('../assets/onboarding3.png')} />,
          title: 'QuickPads. No Account Required',
            subtitle: "You don't need to sign up for QuickPads, making them perfect for one time uses. Just save the Pad link by sharing it somewhere.",
          },{
            backgroundColor: '#43a048',
            image: <Image style={{width: 350, height: 350}} source={require('../assets/onboarding2.png')} />,
          title: 'Create There. View Here.',
            subtitle: "Pads created on Collabpads.com or in app can be viewed and shared anywhere by whomever you want.",
          },
        ]}
        onSkip={this.completeOnboarding}
        onDone={this.completeOnboarding}
      />
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token,
});

export default connect(mapStateToProps, {  })(AppIntro);
