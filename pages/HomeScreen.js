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
import { fetchLists } from '../redux/actions/listActions.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9'
  },
  main: {
    flex: 1,
  },
  no__pads: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    ...ifIphoneX({paddingTop: 48}, {paddingTop: 30})
  }
});

class HomeScreen extends Component {

  constructor(){
    super();
    this.state = {
      refreshing: false
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
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){
      this.props.fetchLists(LISTS_URL, this.props.token);
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.fetchLists(LISTS_URL, this.props.token);
    this.setState({refreshing: this.props.loading});
  }

  render() {
    // Remove the listener when you are done
    const containerStyle = {
      flex: 1,
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };

    var pads = this.props.data.map((pad) => (
        <PadCard key={pad.static_id} data={pad} navigate={() => this.props.navigation.navigate('Details', pad)} />
      ));
    return (
        <View style={styles.container}>
          <Animated.View style={containerStyle}>
          {pads.length > 0 && <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}
              refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            <View>
              {pads}
            </View>
          </ScrollView>}
          {pads.length <= 0 && <View style={styles.no__pads}><Text>No Pads</Text></View>}
          <BottomNav navigator={this.props.navigation}/>
          </Animated.View>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  data: state.lists.data,
  loading: state.lists.loading
});

export default connect(mapStateToProps, { fetchLists })(HomeScreen);
