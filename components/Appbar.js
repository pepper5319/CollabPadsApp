import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';

import { Appbar } from 'react-native-paper';

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'transparent',
  },
});

export default class AP extends Component {
  render() {
    return (
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content
          title="My Pads"
        />
      </Appbar.Header>
    );
  }
}
