import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image, Animated, KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper'

import PadCard from '../components/PadCard.js';
import BottomPadNav from '../components/BottomPadNav.js';
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
  },
  card:{
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16
  }
});

class NewItemCard extends Component{

  constructor(){
    super();
    this._visibility = new Animated.Value(0);
    this.state = {
      itemName: '',
      itemDesc: ''
    }
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  render(){
    const cardStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };
    return(
      <Card style={[styles.card, cardStyle]}>
        <Card.Content>
          <TextInput
            style={{marginBottom: 10}}
            label='Item Name'
            value={this.state.itemName}
            onChangeText={itemName => this.setState({ itemName })}
            mode='outlined'
            autoFocus={true}
            onSubmitEditing={() => { this.secondTextInput.focus(); }}
          />
          <TextInput
            ref={(input) => { this.secondTextInput = input; }}
            label='Item Description (Optional)'
            value={this.state.itemDesc}
            onChangeText={itemDesc => this.setState({ itemDesc })}
            mode='outlined'
            multiline
            returnKeyType='done'
            blurOnSubmit={true}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => console.log("CANCELLED ITEM")}>Cancel</Button>
          <Button onPress={() => console.log("ADDED ITEM")}>Add</Button>
        </Card.Actions>
      </Card>
    );
  }
}

class HomeScreen extends Component {

  constructor(){
    super();
    this.state = {
      padID: null,
      padName: null,
      newItemCardVisible: false,
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

  _toggleNewItemCard = () => {
    this.setState({ newItemCardVisible: !this.state.newItemCardVisible});
  }

  render() {
    var items = this.props.items.map((item) => (
      <Item key={item.static_id} data={item} />
    ));
    const { navigation } = this.props;
    const name = "bgImage" + navigation.getParam('static_id', 'NO ID');
    var newCard = ((this.state.newItemCardVisible) ? <NewItemCard /> : null)
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
          {newCard}
          <Transition appear="right">
          <ScrollView style={styles.main} contentContainerStyle={styles.contentContainer}>
            {items}
          </ScrollView>
          </Transition>
          <BottomPadNav onFABPress={this._toggleNewItemCard}/>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  items: state.items.items
});

export default connect(mapStateToProps, { fetchItems })(HomeScreen);
