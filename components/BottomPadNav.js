import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Share} from 'react-native';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { FAB, BottomNavigation, Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { SHARED_LINK_URL } from '../redux/listrUrls.js';

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

  constructor(){
    super();
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          SHARED_LINK_URL + this.props.data,
      },{
        dialogTitle: "Share This Pad"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <View>
        <Appbar style={styles.appbar}>
          <Appbar.Action icon="share" onPress={() => this.onShare()} />
        </Appbar>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { })(BottomNav);
