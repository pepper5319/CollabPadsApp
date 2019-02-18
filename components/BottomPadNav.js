import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { FAB, BottomNavigation } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'white',
    ...ifIphoneX({
            paddingBottom: 50,
            paddingTop: 30
        })
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

  render() {
    return (
      <View>
        <Appbar style={styles.appbar}>
          <Appbar.Action icon="face" onPress={() => console.log('Pressed mail')} />
        </Appbar>
        
          <FAB
            style={styles.fab}
            icon="add"
            onPress={() => console.log('Pressed')}
          />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { })(BottomNav);
