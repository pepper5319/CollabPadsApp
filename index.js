/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import RootComp from './RootComp';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => RootComp);
