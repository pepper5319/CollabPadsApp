import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';
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

  constructor(){
    super();
    this._visibility = new Animated.Value(0);
  }

  componentDidMount(){
    Animated.timing(this._visibility, {
      toValue: 1,
      duration: 300,
    }).start();
  }

  componentWillDismount(){
    Animated.timing(this._visibility, {
      toValue: 0,
      duration: 300
    }).start()
  }

  render(){
    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      scale: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };
    return(
      <Animated.View style={containerStyle}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={{paddingTop: 16}}>{this.props.data.name}</Title>
            <Paragraph>{this.props.data.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button onPress={(e) => this.props.onRemove(e, this.props.data.static_id, this.props.listID)}>Remove</Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    );
  }
}

export default Item;
