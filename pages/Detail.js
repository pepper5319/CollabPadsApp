import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView, Image} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import PadCard from '../components/PadCard.js';
import BottomNav from '../components/BottomPadNav.js';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#c8e6c9'
  },
  main: {
    flex: 1
  },
  image: {
    flex: 1
  },
  item__container: {
    flex: 5
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
    ...ifIphoneX({paddingTop: 40}, {paddingTop: 30})
  },
  bg__title:{
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 10
  }
});

class HomeScreen extends Component {
  render() {
    const { navigation } = this.props;
    const padId = navigation.getParam('static_id', 'NO-ID');
    const padName = navigation.getParam('name', 'NO PAD AVALIABLE');
    return (
        <View style={styles.container}>
          <Transition shared="bgImage" >
            <FitImage
              source={{ uri: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }}
            >
            <Transition appear='scale'>
              <Text style={styles.bg__title}>{padName}</Text>
            </Transition>
          </FitImage>
          </Transition>
          <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}>
          </ScrollView>
          <BottomNav />
        </View>
    );
  }
}


const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(HomeScreen);
