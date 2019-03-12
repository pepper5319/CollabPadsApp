import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image, Animated, KeyboardAvoidingView, Keyboard, RefreshControl, Linking, Share} from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import FitImage from 'react-native-fit-image';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { Card, Title, Paragraph, Button, TextInput, Appbar } from 'react-native-paper'

import PadCard from '../components/PadCard.js';
// import BottomPadNav from '../components/BottomPadNav.js';
import Item from '../components/Item.js';

import { LISTS_URL, ITEMS_URL, SHARED_LINK_URL } from '../redux/listrUrls.js';
import { fetchSingleList } from '../redux/actions/listActions.js';
import { fetchQuickPadItems, performQuickItemPost, deleteQuickItem, clearItems } from '../redux/actions/itemActions.js';
import { changeFABFunction, changeFAB, noFAB } from '../redux/actions/navActions.js';

const GUEST_KEY = 'd0b7b2803369922e5e8e2716ec4f296b2f224bed'; //PRODUCTION
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
  appbar: {
    backgroundColor: 'white',
    ...ifIphoneX({
            paddingBottom: 50,
            paddingTop: 30
        })
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

class BottomPadNav extends Component {

  constructor(){
    super();
  }

  onBack = () => {
    if(this.props.token !== undefined && this.props.token !== null && this.props.token !== ''){
      this.props.navigator.navigate('App');
    }else{
      this.props.navigator.navigate('Auth');
    }
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          SHARED_LINK_URL + this.props.data,
      },{
        dialogTitle: "Share This Pad"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <View>
        <Appbar style={styles.appbar}>
          <Appbar.Action icon="clear" onPress={() => this.onBack()} />
          <Appbar.Action icon="share" onPress={() => this.onShare()} />
        </Appbar>
      </View>
    );
  }
}

class QuickPad extends Component {

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
      scrollY: new Animated.Value(0)
    }
    this._visibility = new Animated.Value(0);
    this.didBlur = null;
  }

  componentWillReceiveProps(props){

  }
  componentDidMount(){
    console.log("MOUNTED")
    Linking.getInitialURL().then((url) => {
      console.log(url);
      if (url) {
        const route = url.replace(/.*?:\/\//g, '');
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        const data = {pad_id: id};
        this.setState({padID: id});
        this.props.fetchSingleList(LISTS_URL, id, GUEST_KEY);
        this.props.fetchQuickPadItems(ITEMS_URL, id, GUEST_KEY);
      }else{
        const { navigation } = this.props;
        const pad_id = navigation.getParam('pad_id', '-1');
        console.log(pad_id);
        if(pad_id !== '-1'){
          this.setState({padID: pad_id});
          this.props.fetchSingleList(LISTS_URL, pad_id, GUEST_KEY);
          this.props.fetchQuickPadItems(ITEMS_URL, pad_id, GUEST_KEY);
        }else{
        }
      }
    }).catch(err => console.error('An error occurred', err));
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
    console.log("UPDATE");
    if(this.state.padID === null || this.state.padID === undefined){
      const { navigation } = this.props;
      const pad_id = navigation.getParam('pad_id', '-1');
      console.log(pad_id);
      if(pad_id !== '-1'){
        this.setState({padID: pad_id});
        this.props.fetchSingleList(LISTS_URL, pad_id, GUEST_KEY);
        this.props.fetchQuickPadItems(ITEMS_URL, pad_id, GUEST_KEY);
      }else{
      }
    }

    if(this.props.list !== null && this.props.list !== undefined){
      if(this.state.padName === null){
        this.setState({padName: this.props.list.name});
      }
    }
  }

  componentWillDismount(){
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
      this.props.performQuickItemPost(ITEMS_URL, data, this.state.padID, GUEST_KEY);
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
    this.props.deleteQuickItem(ITEMS_URL, itemID, listID, GUEST_KEY);
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
    this.props.fetchQuickPadItems(ITEMS_URL, this.state.padID, GUEST_KEY);
    this.setState({refreshing: this.props.loading});
  }

  render() {
    try {
    var items = this.props.items.map((item) => (
      <Item key={item.static_id} data={item} listID={this.state.padID} onRemove={this._deleteItem} readOnly={this.state.readOnly} guest={GUEST_KEY}/>
    ));
    }catch(error){
      console.log(error);
      this.props.navigation.navigate('Auth');
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

    var newCard = ((this.state.newItemCardVisible) ? <NewItemCard performItemPost={this._performItemPost} toggleNewItemCard={this._toggleNewItemCard}/> : null)
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
              {items}
            </Animated.ScrollView>
          </Animated.View>
          <BottomPadNav data={this.state.padID} navigator={this.props.navigation} token={this.props.token}/>
        </View>
    );

  }
}


const mapStateToProps = state => ({
  items: state.items.items,
  list: state.lists.list,
  loading: state.items.loading,
  token: state.users.token,
});

export default connect(mapStateToProps, { fetchSingleList, fetchQuickPadItems, performQuickItemPost, deleteQuickItem, clearItems, changeFABFunction, changeFAB, noFAB })(QuickPad);
