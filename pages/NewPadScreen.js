import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Animated, RefreshControl, FlatList} from 'react-native';
import { TextInput, Headline, TouchableRipple, Text, Chip, Switch, Subheading, Button } from 'react-native-paper';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { StackActions, NavigationActions, Transitioner } from 'react-navigation';
import { connect } from 'react-redux';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

import { LISTS_URL } from '../redux/listrUrls.js';
import { performListPost } from '../redux/actions/listActions.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9',
  },
  main: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    ...ifIphoneX({paddingTop: 40,
                  marginTop: 48
                },{
                  paddingTop: 30,
                  marginTop: 32})
  },
  input__container: {
    flex:1,
  },
  collab__item: {
    marginTop: 8,
    marginRight: 8
  },
  collab__list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  }
});

class NewPadScreen extends Component {

  constructor(){
    super();
    this.state = {
      padName: '',
      newCollab: '',
      collabList: [],
      readOnly: false
    },
    this._visibility = new Animated.Value(0);
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  componentDidMount(){
    if(this.props.token !== null && this.props.token !== undefined && this.props.token !== ''){
    }
  }

  componentDidUpdate(){
    const { goBack } = this.props.navigation;
    if(this.props.successfulPost === true){
      goBack();
    }
  }

  addCollab = () => {
    if(this.state.newCollab !== ""){
      var newCollab = this.state.newCollab
      this.setState((prevState) => {
        return {
          collabList: prevState.collabList.concat(newCollab)
        };
      });
    };
    this.setState({newCollab: ''});
  }
  deleteItem = (key) => {
    var filteredItems = this.state.collabList;
    var ind = filteredItems.indexOf(key);
    if(ind > -1){
      filteredItems.splice(ind, 1);
      this.setState({
        collabList:filteredItems
      });
    }
  }

  createNewList = () => {
    const listData = {
      "name": this.state.padName,
      "static_id": this.makeid(),
      "collabs": this.state.collabList,
      "readOnly": this.state.readOnly
    }
    this.props.performListPost(LISTS_URL, listData, this.props.token);
    this.setState({collabList: [], newCollab: ""});

  }
  makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      // duration in milliseconds, default: 250
      duration: 0,
      // An easing function from `Easing`, default: Easing.inOut(Easing.ease)
    }
  }

  render() {

    var collabs = this.state.collabList.map((collab) => <Chip key={collab} icon="face" style={styles.collab__item} onClose={() => this.deleteItem(collab)}>{collab}</Chip>);

    const iconStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };



    return (
        <View style={styles.container}>
          <View style={styles.main}>
            <Animated.View style={[{flex: 1}, iconStyle]}>
            <Headline style={{marginTop: 16, marginBottom: 16}}>New Pad</Headline>
            <TextInput
              label='Name Your Pad'
              value={this.state.padName}
              mode='outlined'
              onChangeText={padName => this.setState({ padName })}
              style={{marginBottom: 10}}
              onSubmitEditing={() => { this.secondTextInput.focus(); }}
            />
            <TextInput
              label='Add A Collaborator (by Username)'
              value={this.state.newCollab}
              mode='outlined'
              onChangeText={newCollab => this.setState({ newCollab })}
              autoCapitalize='none'
              onSubmitEditing={() => this.addCollab()}
              ref={(input) => { this.secondTextInput = input; }}
              returnKeyType='done'

            />
            <View style={styles.collab__list}>
              {collabs}
              <Switch
                style={{marginTop: 10}}
                value={this.state.readOnly}
                onValueChange={() =>
                  { this.setState({ readOnly: !this.state.readOnly }); }
                }
              />
            <Subheading style={{fontWeight: '500', marginTop: 10}}> Like Only</Subheading>
            </View>
            <View style={{flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
              <Button style={{marginBottom: 48}} mode="outlined" onPress={() => this.createNewList()}>
                Create Pad
              </Button>
            </View>
            </Animated.View>
          </View>
        </View>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
  successfulPost: state.lists.successfulPost
});

export default connect(mapStateToProps, { performListPost })(NewPadScreen);
