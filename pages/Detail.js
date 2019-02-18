import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView, Image} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

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
    flex: 2
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
  }
});

class HomeScreen extends Component {
  render() {
    const { navigation } = this.props;
    const padId = navigation.getParam('static_id', 'NO-ID');
    const padName = navigation.getParam('name', 'NO PAD AVALIABLE');
    return (
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.image}>
              <Transition shared="bgImage">
                <FitImage
                  source={{ uri: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }}
                  originalWidth={400}
                  originalHeight={400}
                />
              </Transition>
            </View>
            <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}>
            </ScrollView>
          </View>
          <BottomNav />
        </View>
    );
  }
}


const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(HomeScreen);
