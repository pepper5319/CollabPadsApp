import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

const styles = StyleSheet.create({
  card:{
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16
  }
});

class PadCard extends Component {
  render(){
    const name = "bgImage" + this.props.data.static_id;
    return(
      <Card style={styles.card} onPress={this.props.navigate}>
        <Transition shared={name}>
          <Card.Cover style={{borderTopLeftRadius: 16, borderTopRightRadius: 16}} source={{ uri: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjUyNDU1fQ' }} />
        </Transition>
          <Card.Content>
            <Title style={{paddingTop: 16}}>{this.props.data.name}</Title>
          </Card.Content>
      </Card>
    );
  }
}

export default PadCard;
