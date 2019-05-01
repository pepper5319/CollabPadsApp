import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Animated, RefreshControl, Dimensions, Image, Easing} from 'react-native';
import { FAB, Card, Appbar, Banner, Avatar, ActivityIndicator, Portal, Dialog, Button } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import PadCard from '../components/PadCard.js';
import BottomNav from '../components/BottomNav.js';

import { LISTS_URL, USER_URL, LOGOUT_URL } from '../redux/listrUrls.js';
import { fetchLists } from '../redux/actions/listActions.js';
import { getUserData, performLogout } from '../redux/actions/userActions.js';


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
    ...ifIphoneX({paddingTop: 48}, {paddingTop: Platform.OS === 'ios' ? 16 : 0,})
  },
  card:{
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#e9e9e9'
  },
});

class LoadingCard extends Component {
  constructor(){
    super();
    this._loadingVisibility = new Animated.Value(0);
  }

  componentWillMount(){

  }

  render(){
    const cardStyle = {
      opacity: this._loadingVisibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.75],
      })
    };

    return(
      <Card style={[styles.card, cardStyle]}>
          <Card.Cover style={{borderTopLeftRadius: 16, borderTopRightRadius: 16, opacity: 0}} source={{ uri: 'https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }} />
          <Card.Title
            title=""/>
      </Card>
    );
  }
}

class HomeScreen extends Component {

  constructor(){
    super();
    this.state = {
      refreshing: false,
      index: 0,
      routes: [
        { key: 'first', title: 'My Pads' },
        { key: 'second', title: 'Collab Pads' },
      ],
      confirmLogout: false
    }
    this._visibility = new Animated.Value(0);
    this._tabVisibility = new Animated.Value(0);
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();

    Animated.timing(this._tabVisibility, {
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

  _goToNewPad = () => {
    Animated.timing(this._tabVisibility, {
      toValue: 0,
      duration: 300,
    }).start(() => {
      Animated.timing(this._tabVisibility, {
        toValue: 1,
        duration: 300,
      }).start();
    });
  }

  _showDialog = () => this.setState({ confirmLogout: true });

  _hideDialog = () => this.setState({ confirmLogout: false });


  onLogout = () => {
    this.props.performLogout(LOGOUT_URL);
    this.props.navigation.navigate('Auth');
  }

  render() {
    // Remove the listener when you are done
    var pads = null
    var sharedPads = null
    if(this.props.data !== undefined){ pads = this.props.data; }
    if(this.props.sharedData !== undefined){ sharedPads = this.props.sharedData; }
    const containerStyle = {
      flex: 1,
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };

    const tabVisibility = {
      opacity: this._tabVisibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };
    if(pads !== null){
      var pads = pads.map((pad) => (
        <PadCard key={pad.static_id} data={pad} navigate={() => this._goToDetail(pad)} />
      ));
    }
    if(sharedPads !== null){
    var sharedPads = sharedPads.map((pad) => (
        <PadCard key={pad.static_id} data={pad} isShared={true} navigate={() => this._goToDetail(pad)} />
      ));
    }
    const MyPads = () => (
      <View style={styles.container}>
        <Animated.View style={containerStyle}>
        <ScrollView style={styles.main} contentContainerStyle={{paddingTop: 16}}
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View>

            {pads === null && <ActivityIndicator size='large' animating={true} /> }

            {pads !== null && pads.length <= 0 &&
              <Banner
                visible={pads.length <= 0}
                actions={[
                  {
                    label: 'Create Pad',
                    onPress: () => this.props.fabFunction(),
                  },
                ]}
                image={({ size }) =>
                  <Avatar.Icon size={size} icon="view-list" />
                }
              >
                You don't have any pads. Try making one now!
              </Banner>
            }
            {pads}
          </View>
        </ScrollView>
        </Animated.View>
      </View>
    );
    const SharedPads = () => (
      <View style={styles.container}>
        <Animated.View style={containerStyle}>
        <ScrollView style={styles.main} contentContainerStyle={{paddingTop: 16}}
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View>
            {sharedPads === null && <ActivityIndicator size='large' animating={true} /> }

            {sharedPads !== null && sharedPads.length <= 0 &&
              <Banner
                visible={sharedPads.length <= 0}
                actions={[

                ]}
                image={({ size }) =>
                  <Avatar.Icon size={size} icon="group" />
                }
              >
                No one has added you as a collaborator to their pads.
              </Banner>
            }
            {sharedPads}
          </View>
        </ScrollView>
        </Animated.View>

      </View>
    );

    const renderTabBar = (props) => <TabBar{...props} indicatorStyle={{ backgroundColor: '#43a048' }} labelStyle={{color: 'black'}} style={[styles.contentContainer, tabVisibility, { backgroundColor: 'white', textColor: 'black'}]}/>;

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
          <BottomNav onLogout={this._showDialog} buttonFunction={this._goToNewPad} navigator={this.props.navigation}/>
          </Animated.View>
          <Portal>
            <Dialog
               visible={this.state.confirmLogout}
               onDismiss={this._hideDialog}>
              <Dialog.Title>Sign Out of Your Account?</Dialog.Title>
              <Dialog.Actions>
                <Button onPress={this.onLogout}>Yes</Button>
                <Button onPress={this._hideDialog}>No</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  data: state.lists.data,
  sharedData: state.lists.sharedData,
  loading: state.lists.loading,
  fabFunction: state.nav.fabFunction
});

export default connect(mapStateToProps, { fetchLists, performLogout })(HomeScreen);
