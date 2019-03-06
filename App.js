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
    if(this.props.fabFunction == 'home' && this.props.nav !== null  && this.props.nav !== undefined){
      this._goToNewPad()
    }
  }

  _goToNewPad = () => {
    Animated.timing(this._iconOpacity, {
      toValue: 0,
      duration: 100,
    }).start(() => {

      Animated.timing(this._verticalPos, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1)
      }).start(() => {
        this.props.nav.navigate("NewPad");
        Animated.timing(this._verticalPos, {
          toValue: 0,
          duration: 300,
        }).start();
      });

    });
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

    var icon = (this.props.fabFunction === 'home') ? 'create' : 'add'

    var minHeight = isIphoneX() ? 50 : 0;
    var maxHeight = isIphoneX() ? 50 : 25;
    const containerStyle = {
      paddingBottom: this._verticalPos.interpolate({
        inputRange: [0, 1],
        outputRange: [minHeight, (Dimensions.get('window').height-(maxHeight+28))],
      }),
    };
    const iconStyle = {
      opacity: this._iconOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      flexDirection: 'row',
      color: 'black'
    };
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
                this.props.changeFAB(null);
              }
            }
          }}/>
        {this.props.fabFunction !== null &&
          <View style={{backgroundColor: '#c8e6c9'}}>
            <Appbar style={[styles.appbar,  containerStyle]}>
              <Animated.View style={iconStyle}>
                <Appbar.Action color="black" icon="clear" onPress={() => this.props.performLogout(LOGOUT_URL)} />
                <Appbar.Action color="black" icon="face" onPress={() => console.log('Pressed mail')} />
              </Animated.View>
              <FAB
                style={[styles.fab]}
                color='white'
                icon={icon}
                onPress={() => this.handleFABClick()}
              />
            </Appbar>
          </View>
        }
      </View>);
  }
}

const mapStateToProps = state => ({
  token: state.users.token,
  fabFunction: state.nav.fab,
  nav: state.nav.nav
});

export default connect(mapStateToProps, { changeFAB })(App);
