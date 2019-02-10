import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import  App  from './App';
import store from './redux/store';

export default class RootComp extends React.Component {
  constructor() {
    super();
  };
  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <App />
        </PaperProvider>
      </Provider>
    );
  }
}
