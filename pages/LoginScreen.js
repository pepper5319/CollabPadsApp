import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import { FAB, Card, Appbar } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9'
  },
  main: {
    flex: 1,
  },
  bottom__bar: {
    flexGrow: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 30,
    paddingBottom: 50,
  },
  contentContainer: {
    ...ifIphoneX({paddingTop: 40}, {paddingTop: 30})
  }
});

class Login extends Component {
  render() {
    return (
        <View style={styles.container}>
          <Text>Login</Text>
        </View>
    );
  }
}
const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(Login);
