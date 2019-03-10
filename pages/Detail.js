import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image, Animated, KeyboardAvoidingView, Keyboard, RefreshControl} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper'

import PadCard from '../components/PadCard.js';
import BottomPadNav from '../components/BottomPadNav.js';
import Item from '../components/Item.js';

import { LISTS_URL, ITEMS_URL } from '../redux/listrUrls.js';
import { fetchLists } from '../redux/actions/listActions.js';
import { fetchItems, performItemPost, deleteItem, clearItems } from '../redux/actions/itemActions.js';
import { changeFABFunction } from '../redux/actions/navActions.js';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = (isIphoneX()) ? 100 : 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#c8e6c9'
  },
  main: {
    flex: 1,
    // backgroundColor: '#c8e6c9'
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
    paddingTop: HEADER_MAX_HEIGHT - 64
  },
  bg__title:{
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 10,
    textAlign: "center",
  },
  card:{
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,

  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
});

class NewItemCard extends Component {
  constructor() {
    super();
    this.state={
      itemDesc: '',
      itemName: ''
    }
    this._newCardVisibility = new Animated.Value(0);
  }
  componentWillMount(){
    Animated.timing(this._newCardVisibility, {
      toValue: 1,
      duration: 300
    }).start()
  }

  componentWillDismount(){
    Animated.timing(this._newCardVisibility, {
      toValue: 0,
      duration: 300
    }).start()
  }

  render(){

    const cardStyle = {
      opacity: this._newCardVisibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };

    return(
      <Card style={[styles.card, cardStyle]}>
        <Card.Content>
          <TextInput
            style={{marginBottom: 10, backgroundColor: 'white'}}
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
            onSubmitEditing={() => this.props.performItemPost(this.state.itemName, this.state.itemDesc) }
            style={{backgroundColor: 'white'}}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={this.props.toggleNewItemCard}>Cancel</Button>
          <Button onPress={() => this.props.performItemPost(this.state.itemName, this.state.itemDesc)}>Add</Button>
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
      itemName: '',
      itemDesc: '',
      refreshing: false,
      readOnly: false,
      scrollY: new Animated.Value(0)
    }
    this._visibility = new Animated.Value(0);
    this.didBlur = null;
  }

  componentWillReceiveProps(props){

  }
  componentDidMount(){
    const { navigation } = this.props;
    this.setState({ padID: navigation.getParam('static_id', 'NO ID'),
                    padName: navigation.getParam('name', 'NO PAD AVALIABLE'),
                    readOnly: navigation.getParam('readOnly', false)
                  });
    this.props.fetchItems(ITEMS_URL, navigation.getParam('static_id', 'NO ID'), this.props.token);
    this.props.changeFABFunction(this._toggleNewItemCard);
    this.didBlur = navigation.addListener(
      'didBlur',
      payload => {
        this.props.clearItems();
        Animated.timing(this._visibility, {
          toValue: 0,
          duration: 300,
        }).start();
      }
    );
  }

  componentDidUpdate(){
    if(this.props.items !== null && this.props.items !== undefined && this.props.items.length >= 0){
      Animated.timing(this._visibility, {
        toValue: 1,
        duration: 300,
      }).start();
    }
  }

  componentWillDismount(){
    this.didBlur.remove();
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  _performItemPost = (itemName, itemDesc) => {
    if(itemName !== ''){
      const data = {
        "name": itemName, "static_id": this.makeid()}
      if(itemDesc !== '') {
        data.description = itemDesc
      }
      this.props.performItemPost(ITEMS_URL, data, this.state.padID, this.props.token);
      Keyboard.dismiss();
      this.setState({ newItemCardVisible: !this.state.newItemCardVisible,
                      itemName: '',
                      itemDesc: ''});
    }else{
      console.log("NAME EMPTY");
    }
  }

  _deleteItem = (e, itemID, listID) => {
    e.preventDefault();
    this.props.deleteItem(ITEMS_URL, itemID, listID, this.props.token);
  }

  _toggleNewItemCard = () => {
    if(this.state.newItemCardVisible === true){
      this.setState({ newItemCardVisible: !this.state.newItemCardVisible});
    }else{
      this.setState({ newItemCardVisible: !this.state.newItemCardVisible,
                      itemName: '',
                      itemDesc: ''});
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.fetchItems(ITEMS_URL, this.state.padID, this.props.token);
    this.setState({refreshing: this.props.loading});
  }

  render() {
    var items = this.props.items.map((item) => (
      <Item key={item.static_id} data={item} listID={this.state.padID} onRemove={this._deleteItem}/>
    ));
    const { navigation } = this.props;
    const name = "bgImage" + navigation.getParam('static_id', 'NO ID');



    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE / 2],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE - (HEADER_SCROLL_DISTANCE/3)],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE/4],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    var newCard = ((this.state.newItemCardVisible) ? <NewItemCard performItemPost={this._performItemPost} toggleNewItemCard={this._toggleNewItemCard}/> : null)
    return (
        <View style={styles.container}>
          <Animated.View style={[styles.header, {transform: [{ translateY: headerTranslate }], justifyContent: 'center', alignItems: 'center'}]}>
            <Animated.Image
              style={[
                styles.backgroundImage,
                {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
              ]}
              source={{uri: 'https://images.unsplash.com/photo-1549526809-d207fdd074e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80'}}
              />
            <Animated.Text style={[styles.bg__title, {opacity: titleOpacity}]}>{this.state.padName}</Animated.Text>
          </Animated.View>
          <Animated.View style={[styles.main, containerStyle]}>
            <Animated.ScrollView
              style={styles.main}
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: true },
              )}>
              {newCard}
              {items}
            </Animated.ScrollView>
          </Animated.View>
          <BottomPadNav data={this.state.padID}/>
        </View>
    );

  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  items: state.items.items,
  loading: state.items.loading
});

export default connect(mapStateToProps, { fetchItems, performItemPost, deleteItem, clearItems, changeFABFunction })(HomeScreen);
