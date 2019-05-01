import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image,
        Animated, KeyboardAvoidingView, Keyboard, RefreshControl, NetInfo} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { Card, Title, Paragraph, Button, TextInput, Appbar } from 'react-native-paper'

import PadCard from '../components/PadCard.js';
import BottomPadNav from '../components/BottomPadNav.js';
import Item from '../components/Item.js';

import { LISTS_URL, ITEMS_URL } from '../redux/listrUrls.js';
import { fetchLists } from '../redux/actions/listActions.js';
import { fetchItems, performItemPost, deleteItem, clearItems } from '../redux/actions/itemActions.js';
import { changeFABFunction, changeFAB, noFAB } from '../redux/actions/navActions.js';

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
    top:0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    ...ifIphoneX({top: 32}, {top: 0})
  }
});

class NewItemCard extends Component {
  constructor() {
    super();
    this.state={
      itemDesc: '',
      itemName: ''
    }
  }


  render(){


    return(
      <Card style={[styles.card]}>
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
      padBgUrl: 'https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ',
      padBgOwner: 'Aleks Dorohovich',
      padBgOwnerUrl: 'https://unsplash.com/@aleksdorohovich',
      newItemCardVisible: false,
      itemName: '',
      itemDesc: '',
      refreshing: false,
      readOnly: false,
      scrollY: new Animated.Value(0),
      changesToMake: [],
      offlineItems: [{name: 'Test', description: '', static_id: '12345', liked_users: []}],
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
                    padBgUrl: navigation.getParam('background_image_url', null),
                    padBgOwner: navigation.getParam('background_image_url', null),
                    padBgOwnerUrl: navigation.getParam('background_image_url', null),
                    readOnly: navigation.getParam('readOnly', false)
                  });
    if(navigation.getParam('background_image_url', null) === ''){ this.setState({padBgUrl: 'https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ'})}
    if(navigation.getParam('background_image_owner', null) === ''){ this.setState({padBgOwner: 'Aleks Dorohovich'})}
    if(navigation.getParam('background_image_owner_url', null) === ''){ this.setState({padBgOwnerUrl: 'https://unsplash.com/@aleksdorohovich'})}

    this.props.fetchItems(ITEMS_URL, navigation.getParam('static_id', 'NO ID'), this.props.token);
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
    if(this.state.readOnly === true){
      console.log("READ ONLY");
      this.props.noFAB();
    }else{
      this.props.changeFABFunction(this._toggleNewItemCard);
      this.props.changeFAB('details');
    }
    if(this.props.items !== null && this.props.items !== undefined && this.props.items.length >= 0){
      Animated.timing(this._visibility, {
        toValue: 1,
        duration: 300,
      }).start();
    }else if(!(this.props.items !== null && this.props.items !== undefined)){
      this.props.navigation.goBack();
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
      NetInfo.isConnected.fetch().then(isConnected => {
        if(isConnected){
          this.props.performItemPost(ITEMS_URL, data, this.state.padID, this.props.token);
        }else{
          console.log("OFFLINE")
          data.liked_users = []
          data.liked_guests = 0
          if(itemDesc === ''){
            data.description = ''
          }
          this.setState({offlineItems: [data].concat(this.state.offlineItems)});
        }
      });
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
    var offItem = this.state.offlineItems.find(item => item.static_id === itemID);
    if (offItem !== undefined) {
      var index = this.state.offlineItems.indexOf(offItem)
      if (index !== -1) {
        this.setState({offlineItems: this.state.offlineItems.filter((_, i) => i !== index)});
      }
    }else{
      this.props.deleteItem(ITEMS_URL, itemID, listID, this.props.token);
    }

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

  handleItemChange = (type, data) => {
    this.setState({changesToMake: this.state.changesToMake.concat({type, data})});
    switch (type) {
      case 'add':
        this._toggleNewItemCard();
        console.log("ADDED ITEM");
        break;
      case 'like':
        console.log("LIKED ITEM");
        break;
      case 'remove':
        console.log("REMOVED ITEM");
        break;
    }
  }

  render() {
    try {
    var offlineItems = this.state.offlineItems.map((item) => (
      <Item isOffline={true} key={item.static_id} data={item} listID={this.state.padID} onRemove={this._deleteItem} readOnly={this.state.readOnly}/>
    ))
    var items = this.props.items.map((item) => (
      <Item isOffline={false} key={item.static_id} data={item} listID={this.state.padID} onRemove={this._deleteItem} readOnly={this.state.readOnly}/>
    ));
    }catch(error){
      console.log(error);
      this.props.fetchLists(LISTS_URL, this.props.token);
      this.props.navigation.goBack();
    }
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

    var newCard = ((this.state.newItemCardVisible) ?
                    <NewItemCard
                      performItemPost={this._performItemPost}
                      toggleNewItemCard={this._toggleNewItemCard}/>
                    : null)
    return (
        <View style={styles.container}>
          <Animated.View style={[styles.header, {transform: [{ translateY: headerTranslate }], justifyContent: 'center', alignItems: 'center'}]}>
            <Animated.Image
              style={[
                styles.backgroundImage,
                {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
              ]}
              source={{uri: this.state.padBgUrl}}
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
              {offlineItems}
              {items}
            </Animated.ScrollView>
          </Animated.View>
          <BottomPadNav data={this.state.padID} navigator={this.props.navigation}/>
        </View>
    );

  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  items: state.items.items,
  loading: state.items.loading
});

export default connect(mapStateToProps, { fetchLists, fetchItems, performItemPost, deleteItem, clearItems, changeFABFunction, changeFAB, noFAB })(HomeScreen);
