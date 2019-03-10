import { combineReducers } from 'redux';
import listReducer from "./listReducer";
import userReducer from "./userReducer";
import itemReducer from "./itemReducer";
import navReducer from "./navReducer";

export default combineReducers({
  lists: listReducer,
  items: itemReducer,
  users: userReducer,
  nav: navReducer
});
