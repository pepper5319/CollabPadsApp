import { combineReducers } from 'redux';
import listReducer from "./listReducer";
import userReducer from "./userReducer";
import itemReducer from "./itemReducer";

export default combineReducers({
  lists: listReducer,
  items: itemReducer,
  users: userReducer
});
