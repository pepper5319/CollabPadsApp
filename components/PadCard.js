import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton, Portal, Dialog, TextInput, Chip, Switch, Subheading } from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import PadDialog from './PadDialog.js';
import UnfollowDialog from './UnfollowDialog.js';

import { connect } from 'react-redux';
import { USER_URL, LISTS_URL } from '../redux/listrUrls.js';
import { addCollab } from '../redux/actions/listActions.js';


const styles = StyleSheet.create({
  card:{
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16
  },
  collab__item: {
    marginTop: 8,
    marginRight: 8
  },
  collab__list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dialog__title:{
    ...ifIphoneX({paddingTop: 48}, {paddingTop: 30})
  },
  dialog__actions:{
    flex: 1,
    flexDirection: 'row',
    alignItems:'flex-end',
    ...ifIphoneX({marginBottom: 24}, {marginBottom: 16})
  }
});

class PadCard extends Component {

  state = {
    visible: false,
    isShared: false,
    collabs: []
  };

  componentDidMount(props){
    console.log(this.props.isShared);
  }

  _showDialog = () => this.setState({ visible: true });

  _hideDialog = () => this.setState({ visible: false });

  render(){
    const name = "bgImage" + this.props.data.static_id;
    const title = (this.props.data.name.length > 21) ? this.props.data.name.substring(0,21) + "..." : this.props.data.name;
    return(
      <Card style={styles.card} onPress={this.props.navigate}>
          {this.props.data.background_image_url !== undefined && this.props.data.background_image_url !== '' &&
          <Card.Cover style={{borderTopLeftRadius: 16, borderTopRightRadius: 16}} source={{ uri: this.props.data.background_image_url }} />
          }
          {this.props.data.background_image_url === null || this.props.data.background_image_url === undefined || this.props.data.background_image_url === '' &&
            <Card.Cover style={{borderTopLeftRadius: 16, borderTopRightRadius: 16}} source={{ uri: 'https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }} />
          }
          {this.props.isShared && <Card.Title
            title={title}
            subtitle={this.props.data.owner}
            right={(props) => <IconButton {...props} icon="block" onPress={() => this._showDialog()} />}
          />}
          {!this.props.isShared && <Card.Title
            title={title}
            right={(props) => <IconButton {...props} icon="more-vert" onPress={() => this._showDialog()} />}
          />}

          {this.state.visible === true && this.props.isShared !== true && <PadDialog isVisible={this.state.visible} hideDialog={this._hideDialog} data={this.props.data}/>}
          {this.state.visible === true && this.props.isShared === true && <UnfollowDialog isVisible={this.state.visible} hideDialog={this._hideDialog} data={this.props.data}/>}
      </Card>
    );
  }
}


const mapStateToProps = state => ({
  token: state.users.token,
});

export default connect(mapStateToProps, { addCollab })(PadCard);
