import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { FAB, BottomNavigation } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'

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

export default class BottomNav extends Component {

  render() {
    return (
      <View>
        <Appbar style={styles.appbar}>
          <Appbar.Action icon="more-vert" onPress={() => console.log('Pressed archive')} />
          <Appbar.Action icon="face" onPress={() => console.log('Pressed mail')} />
        </Appbar>
        <FAB
          style={styles.fab}
          icon="create"
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  }
}
