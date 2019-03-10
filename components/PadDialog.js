import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Dimensions, Animated, KeyboardAvoidingView, BackHandler} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton, Portal, Dialog, TextInput, Chip, Switch, Subheading, Headline } from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux';
import { addCollab, fetchLists, deleteList } from '../redux/actions/listActions.js';
import { LISTS_URL } from '../redux/listrUrls.js';


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

class PadDialog extends Component {
  state = {
    visible: false,
    padName: '',
    newCollab: '',
    collabList: [],
    readOnly: false,
    username: '',
    requestDelete: false,
    canDelete: false
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
    this.setState({collabList: this.props.data.collaborators});
    this.setState({readOnly: this.props.data.readOnly});
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  addCollabs = () => {
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

  updatePad = (listID) =>{
    if(this.state.newCollab !== null || this.state.newCollab !== ''){
      this.addCollabs();
    }
    const itemData = {
      "collabs": this.state.collabList,
      "name": this.state.padName,
      "readOnly": this.state.readOnly
    }
    this.props.addCollab(LISTS_URL, itemData, this.props.data.static_id, this.props.token);
    this.props.fetchLists(LISTS_URL, this.props.token);
    this.props.hideDialog();
  }

  deletePad(listId){
    if(this.props.token){
      if(this.state.username === this.props.data.owner){
        this.props.deleteList(LISTS_URL, listId, this.props.token);
        this.props.hideDialog();
      }
    }
  }

  requestDelete = () => {
    this.setState({requestDelete: true});
  }

  confirmUsername = (name) => {
    this.setState({username: name});
    if(name === this.props.data.owner){
      this.setState({canDelete: true});
    }else{
      if(this.state.canDelete === true){
        this.setState({canDelete: false});
      }
    }
  }

  _hideDialog = () => {
    this.setState({requestDelete: false});
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

  render(){
    var collabs = this.state.collabList.map((collab) => <Chip key={collab} icon="face" style={styles.collab__item} onClose={() => this.deleteItem(collab)}>{collab}</Chip>);

    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      })
    };

    return(
      <Portal style={{flex: 1, justifyContent: 'flex-start'}}>
        <Dialog
          style={[containerStyle, {flex: 1, marginLeft: 0, width: Dimensions.get('window').width, minHeight: Dimensions.get('window').height}]}
          visible={this.props.isVisible}
          onDismiss={this.props.hideDialog}>
          <View style={{flex: 3, padding: 16}}>
          <Dialog.Title style={styles.dialog__title}>Manage Pad: {this.props.data.name}</Dialog.Title>
            <TextInput
              label='Name of Pad'
              value={this.state.padName}
              mode='outlined'
              onChangeText={padName => this.setState({ padName })}
              style={{marginBottom: 10, backgroundColor: 'white'}}
              onSubmitEditing={() => { this.secondTextInput.focus(); }}
            />
            <TextInput
              label='Add Collaborators (by Username)'
              value={this.state.newCollab}
              mode='outlined'
              onChangeText={newCollab => this.setState({ newCollab })}
              autoCapitalize='none'
              onSubmitEditing={() => this.addCollabs()}
              ref={(input) => { this.secondTextInput = input; }}
              returnKeyType='done'
              style={{marginBottom: 10, backgroundColor: 'white'}}
            />
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={[styles.collab__list]}>
              {collabs}
            </View>
          </ScrollView>

            <KeyboardAvoidingView>
            <View style={{flexDirection: 'row', marginBottom: 16}}>
              <Switch
                value={this.state.readOnly}
                onValueChange={() =>
                  { this.setState({ readOnly: !this.state.readOnly }); }
                }
              />
              <Subheading style={{fontWeight: '500'}}> Like Only</Subheading>
              <Button style={{marginLeft: 16, flexGrow: 1}} mode="contained" onPress={() => this.updatePad(this.props.data.static_id)}>
                Save Pad
              </Button>
            </View>
            <Button style={{marginBottom: 10}} color='red' mode="outlined" onPress={() => this.requestDelete()}>
              Remove Pad
            </Button>

            {this.state.requestDelete === true &&
              <Portal>
              <Dialog
                visible={this.state.requestDelete}
                onDismiss={this._hideDialog}>
                <KeyboardAvoidingView>
                <Dialog.Content>
                  <Dialog.Title>Remove this Pad?</Dialog.Title>
                  <Paragraph style={{fontWeight: '500'}}>Type in your username to confirm</Paragraph>
                    <TextInput
                      value={this.state.username}
                      mode='outlined'
                      error={!this.state.canDelete}
                      onChangeText={username => this.confirmUsername(username)}
                      autoCapitalize='none'
                      onSubmitEditing={() => this.deletePad(this.props.data.static_id)}
                      returnKeyType='done'
                      style={{marginBottom: 10}}
                    />
                </Dialog.Content>
                </KeyboardAvoidingView>
              </Dialog>
            </Portal>
            }
          </KeyboardAvoidingView>
          </View>
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

export default connect(mapStateToProps, { addCollab, fetchLists, deleteList })(PadDialog);
