import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, Animated, Easing} from 'react-native';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { FAB, BottomNavigation } from 'react-native-paper';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import { LOGOUT_URL } from '../redux/listrUrls.js';
import {performLogin, performLogout} from '../redux/actions/userActions.js';

// Dimensions.get('window').height-(50+28),

const styles = StyleSheet.create({
  appbar: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'white',
    ...ifIphoneX({
            paddingBottom: 50,
            paddingTop: 30
        },),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    ...ifIphoneX({
        bottom: 35,
      },
        {bottom: 10,})
  },
});

class BottomNav extends Component {

  constructor(){
    super();
    this._verticalPos = new Animated.Value(0);
    this._iconOpacity = new Animated.Value(1);
    this.didBlurSubscription = null
  }

  _goToNewPad = () => {
    Animated.timing(this._iconOpacity, {
      toValue: 0,
      duration: 100,
    }).start(() => {

      Animated.timing(this._verticalPos, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1)
      }).start(() => {
        this.props.navigator.navigate('NewPad');

      });

    });
  }

  componentDidMount(){
    this.didBlurSubscription = this.props.navigator.addListener(
      'didBlur',
      payload => {
        Animated.timing(this._iconOpacity, {
          toValue: 1,
          duration: 300,
        }).start()
        Animated.timing(this._verticalPos, {
          toValue: 0,
          duration: 300,
        }).start();
      }
    );
  }

  render() {

    const iconStyle = {
      opacity: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      flexDirection: 'row',
      color: 'black'
    };
    const fabStyle = {
      opacity: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [{ scaleX: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }) }, { scaleY: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }) }]
    };
    return (
      <View>


      </View>
    );

    this.didBlurSubscription.remove();
  }
}
const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { performLogout })(BottomNav);
