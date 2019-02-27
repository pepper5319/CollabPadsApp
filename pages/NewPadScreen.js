import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView, Animated, RefreshControl} from 'react-native';
import { FAB, Card, Appbar } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import PadCard from '../components/PadCard.js';
import BottomNav from '../components/BottomNav.js';

import { LISTS_URL } from '../redux/listrUrls.js';
import {  } from '../redux/actions/listActions.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9'
  },
  main: {
    flex: 1,
  },
  contentContainer: {
    ...ifIphoneX({paddingTop: 40}, {paddingTop: 30})
  }
});

class NewPadScreen extends Component {

  constructor(){
    super();
    this.state = {
    }
  }

  componentWillMount(){
  }

  componentDidMount(){
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <Text>NEW PAD</Text>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, {  })(NewPadScreen);
