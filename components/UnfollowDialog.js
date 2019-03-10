import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Dimensions, Animated, KeyboardAvoidingView, BackHandler} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton, Portal, Dialog, TextInput, Chip, Switch, Subheading, Headline } from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux';
import { addCollab, fetchLists, deleteList } from '../redux/actions/listActions.js';
import { LISTS_URL, USER_URL } from '../redux/listrUrls.js';


const styles = StyleSheet.create({

});

class UnfollowDialog extends Component {
  state = {
    visible: false,
    collabs: [],
  };

  constructor(){
    super();
    this._visibility = new Animated.Value(0);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    Animated.timing(this._visibility, {
      toValue: 0,
      duration: 300,
    }).start();
  }

  handleBackButtonClick() {
    this.props.hideDialog();
    return true;
  }

  unfollow = (id) =>{
    this.setState({collabs: this.props.data.collaborators});

    fetch(USER_URL, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Token ' + this.props.token,
      },
    })
    .then(res => res.json())
    .then(data => {
      if(data.username){
        var filteredItems = this.state.collabs;
        console.log(filteredItems);
        var ind = filteredItems.indexOf(data.username);
        if(ind > -1){
          filteredItems.splice(ind, 1);
          this.setState({
            collabs:filteredItems
          });
          const itemData = {
            "collabs": this.state.collabs,
          }
          this.props.addCollab(LISTS_URL, itemData, id, this.props.token);
          this.setState({
            collabs: [],
          });
          this.props.hideDialog();
        }else{
          alert("Could Not Unfollow List " + id)
        }
      }
    });
  }

  render(){

    return(
      <Portal>
        <Dialog
          visible={this.props.isVisible}
          onDismiss={this.props.hideDialog}>
            <Dialog.Title style={styles.dialog__title}>Unfollow Pad: {this.props.data.name}?</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Once you unfollow, the only way to access it again is if the owner adds you as a collab or shares the link with you.</Paragraph>
              </Dialog.Content>
            <Button style={{margin: 10}} color='red' onPress={() => this.unfollow(this.props.data.static_id)}>
              Yes, Unfollow
            </Button>
          <Dialog.Actions style={styles.dialog__actions}>
            <Button onPress={this.props.hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
});

export default connect(mapStateToProps, { addCollab, fetchLists, deleteList })(UnfollowDialog);
