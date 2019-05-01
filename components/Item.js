import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, NetInfo} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton, Chip, Subheading } from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { USER_URL, ITEMS_URL } from '../redux/listrUrls.js';
import {connect} from 'react-redux';
import { likeItem, likeQuickItem } from '../redux/actions/itemActions.js';


const styles = StyleSheet.create({
  card:{
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16
  }
});

class Item extends Component {

  constructor(){
    super();
    this.state = {
      isLiked: false
    }
  }

  componentDidMount(){
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
        var index = this.props.data.liked_users.indexOf(data.username);
        if (index > -1) {
          this.setState({ isLiked: true });
        }else{
          this.setState({ isLiked: false });
        }
      }
    });

  }

  componentWillDismount(){
  }

  _onLike = (itemData, listID) => {
    if(this.props.guest !== undefined){
      const likeData = {"liked_guests": itemData.liked_guests + 1, "static_id": itemData.static_id};
      this.props.likeQuickItem(ITEMS_URL, likeData, listID, this.props.guest);
      this.setState({ isLiked: true });
    }else{
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
          var index = itemData.liked_users.indexOf(data.username);
          if (index > -1) {
            itemData.liked_users = [];
            this.setState({ isLiked: false });
          }else{
            itemData.liked_users.push(data.username);
            this.setState({ isLiked: true });
          }
          this.props.likeItem(ITEMS_URL, itemData, listID, this.props.token);
        }
      });
    }

  }

  render(){
    var chipColor = (this.state.isLiked) ? {backgroundColor: '#43a048', textColor: 'white'} : {};
    var bgColor = this.props.isOffline ? {backgroundColor: '#f2f2f2'} : {}
    return(
        <Card style={[styles.card, bgColor]} elevation={4}>
          <Card.Content>
            <Title style={{paddingTop: 16}}>{this.props.data.name}</Title>
            {this.props.isOffline && <Subheading style={{fontWeight: '200'}}>Created Offline</Subheading>}
            {this.props.data.description.length > 0 && <Paragraph>{this.props.data.description}</Paragraph> }
          </Card.Content>
          <Card.Actions>
            <Chip style={[chipColor, {marginRight: 8}]} icon="favorite" onPress={() => this._onLike(this.props.data, this.props.listID)}>{this.props.data.liked_users.length + this.props.data.liked_guests}</Chip>
            {this.props.readOnly === false && <Button onPress={(e) => this.props.onRemove(e, this.props.data.static_id, this.props.listID)}>Remove</Button>}
          </Card.Actions>
        </Card>
    );
  }
}

const mapStateToProps = state => ({
  token: state.users.token
});

export default connect(mapStateToProps, { likeItem, likeQuickItem })(Item);
