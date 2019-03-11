import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView, Animated, RefreshControl, Dimensions} from 'react-native';
import { FAB, Card, Appbar } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { TabView, SceneMap } from 'react-native-tab-view';

import PadCard from '../components/PadCard.js';
import BottomNav from '../components/BottomNav.js';

import { LISTS_URL, USER_URL } from '../redux/listrUrls.js';
import { fetchLists } from '../redux/actions/listActions.js';
import { getUserData } from '../redux/actions/userActions.js';
import { setNavigator } from '../redux/actions/navActions.js';


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
    justifyContent: 'flex-end',
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
      refreshing: false,
      index: 0,
      routes: [
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
      ],
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
    }else{
      alert("The account is invalid. Please try logging in again...");
    }
    this.props.setNavigator(this.props.navigation);
  }

  _onRefresh = () => {
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){

    }else{
      alert("The account is invalid. Please try logging in again...");
      this.props.navigation.navigate('Auth');
    }
    this.setState({refreshing: true});
    this.props.fetchLists(LISTS_URL, this.props.token);
    this.setState({refreshing: this.props.loading});
  }

  _goToDetail = (pad) => {
    this.props.navigation.navigate('Details', pad);
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
        <PadCard key={pad.static_id} data={pad} navigate={() => this._goToDetail(pad)} />
      ));

    var sharedPads = this.props.sharedData.map((pad) => (
        <PadCard key={pad.static_id} data={pad} isShared={true} navigate={() => this._goToDetail(pad)} />
      ));

    const MyPads = () => (
      <View style={styles.container}>
        <Animated.View style={containerStyle}>

        <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View>
            {pads.length <= 0 && <View style={styles.no__pads}><Text>No Pads</Text></View>}
            {pads}
          </View>
        </ScrollView>
        </Animated.View>
      </View>
    );
    const SharedPads = () => (
      <View style={styles.container}>
        <Animated.View style={containerStyle}>
        {sharedPads.length <= 0 && <View style={styles.no__pads}><Text>No Collab Pads</Text></View>}
        <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View>
            {sharedPads}
          </View>
        </ScrollView>
        </Animated.View>
      </View>
    );

    const renderTabBar = () => null;

    return (
        <View style={styles.container}>
          <Animated.View style={containerStyle}>
            <TabView
              navigationState={this.state}
              renderScene={SceneMap({
                first: MyPads,
                second: SharedPads,
              })}
              onIndexChange={index => this.setState({ index })}
              initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
              renderTabBar={renderTabBar}
            />
            <BottomNav navigator={this.props.navigation}/>
          </Animated.View>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  data: state.lists.data,
  sharedData: state.lists.sharedData,
  loading: state.lists.loading,
});

export default connect(mapStateToProps, { fetchLists, setNavigator })(HomeScreen);
