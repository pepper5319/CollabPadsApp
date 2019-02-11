import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import  App  from './App';
import store from './redux/store';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#43a048',
    accent: '#43a048',
  }
};

export default class RootComp extends React.Component {
  constructor() {
    super();
  };
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <App />
        </PaperProvider>
      </Provider>
    );
  }
}
