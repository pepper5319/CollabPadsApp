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

class Item extends Component {
  render(){
    return(
      <Card style={styles.card}>
        <Card.Content>
          <Title style={{paddingTop: 16}}>{this.props.data.name}</Title>
          <Paragraph>{this.props.data.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Remove</Button>
        </Card.Actions>
      </Card>
    );
  }
}

export default Item;
