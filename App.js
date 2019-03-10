import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Dimensions, Animated, Easing} from 'react-native';
import {connect} from 'react-redux';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from "react-navigation";
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import {Appbar, FAB} from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { fromLeft, fadeIn, fromRight, fadeOut } from 'react-navigation-transitions';
import { changeFAB } from './redux/actions/navActions.js';

import HomeScreen from './pages/HomeScreen.js';
import Detail from './pages/Detail.js';
import Login from './pages/LoginScreen.js';
import Loading from './pages/LoadingScreen.js';
import NewPadScreen from './pages/NewPadScreen.js';

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'Details') {
    return fromRight();
  } else if (prevScene
    && prevScene.route.routeName === 'Home'
    && nextScene.route.routeName === 'NewPad') {
    return fadeIn(0);
  } else if (prevScene
    && prevScene.route.routeName === 'NewPad'
    && nextScene.route.routeName === 'Home') {
    return fadeOut(0);
  }
  return fromLeft();
}

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



  const MainStack = createStackNavigator(
    {
      Home: HomeScreen,
      Details: Detail,
      NewPad: NewPadScreen
    }, {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false
      },
      initialRouteName: 'Home',
      gesturesEnabled: true,
      mode: 'card',
      transitionConfig: (nav) => handleCustomTransition(nav)
    }
  );

  const AuthStack = createStackNavigator(
    {
      Login: Login
    }, {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false
      },
      initialRouteName: 'Login'
    }
  );

  const AppNavigator = createSwitchNavigator(
    {
      Loading: Loading,
      Auth: AuthStack,
      App: MainStack
    },{
      initialRouteName: 'Loading'
    }
  );
  const AppContainer = createAppContainer(AppNavigator);

class CustomFAB extends Component{
  constructor(){
    super();
    this._iconOpacity = new Animated.Value(0);

  }
  componentWillMount(){
    Animated.timing(this._iconOpacity, {
      toValue: 1,
      duration: 150,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1)
    }).start()
  }

  componentWillDismountMount(){
    Animated.timing(this._iconOpacity, {
      toValue: 0,
      duration: 100,
      easing: Easing.bezier(0.4, 0.0, 1, 1)
    }).start()
  }
  render(){
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
    return(
      <FAB
        style={[styles.fab, fabStyle]}
        color='white'
        icon={this.props.icon}
        onPress={() => this.props.handleFABClick()}
      />
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fabIcon: 'create'
    }
    this.appContainer = null;
    this._verticalPos = new Animated.Value(0);
    this._iconOpacity = new Animated.Value(1);
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  handleFABClick = () =>{
    this.props.fabFunction();
  }

  _goToNewPad = () => {
    this.props.nav.navigate("NewPad");
  }


  getActiveRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  render() {

    var icon = (this.props.fabScreen === 'home') ? 'create' : 'add'


    const iconStyle = {
      opacity: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      flexDirection: 'row',
      color: 'black'
    };


    return (
      <View style={{ flex: 1 }}>
        <AppContainer
          ref={(r) => { this.navigatorRef = r; }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState);
            const prevScreen = this.getActiveRouteName(prevState);
            if (prevScreen !== currentScreen) {
              if(currentScreen == 'Home'){
                this.props.changeFAB('home');
              }
              else if(currentScreen == 'Details'){
                this.props.changeFAB('detail');
              }else{

              }
            }
          }}/>
        {this.props.fabScreen !== null &&
          <CustomFAB icon={icon} handleFABClick={this.handleFABClick}/>
        }
      </View>);
  }
}

const mapStateToProps = state => ({
  token: state.users.token,
  fabScreen: state.nav.fab,
  fabFunction: state.nav.fabFunction,
  nav: state.nav.nav
});

export default connect(mapStateToProps, { changeFAB })(App);
