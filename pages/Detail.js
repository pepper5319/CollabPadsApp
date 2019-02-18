import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ScrollView, Image} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import PadCard from '../components/PadCard.js';
import BottomNav from '../components/BottomPadNav.js';
import Item from '../components/Item.js';

import { LISTS_URL, ITEMS_URL } from '../redux/listrUrls.js';
import { fetchLists } from '../redux/actions/listActions.js';
import { fetchItems } from '../redux/actions/itemActions.js';

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
    ...ifIphoneX({paddingTop: 16})
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

  constructor(){
    super();
    this.state = {
      padID: null,
      padName: null
    }
  }

  componentWillMount(){

  }
  componentDidMount(){
    const { navigation } = this.props;
    this.setState({ padID: navigation.getParam('static_id', 'NO ID'),
                    padName: navigation.getParam('name', 'NO PAD AVALIABLE')
                  });
    this.props.fetchItems(ITEMS_URL, navigation.getParam('static_id', 'NO ID'), this.props.token);
  }

  render() {
    var items = this.props.items.map((item) => (
      <Item key={item.static_id} data={item} />
    ));
    const { navigation } = this.props;
    const name = "bgImage" + navigation.getParam('static_id', 'NO ID');
    return (
        <View style={styles.container}>
          <Transition shared={name} >
            <FitImage
              source={{ uri: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }}
            >
            <Transition appear='scale'>
              <Text style={styles.bg__title}>{this.state.padName}</Text>
            </Transition>
          </FitImage>
          </Transition>

            <Transition appear="right">
          <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}>
            {items}
          </ScrollView>

          </Transition>
          <BottomNav />
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  items: state.items.items
});

export default connect(mapStateToProps, { fetchItems })(HomeScreen);
