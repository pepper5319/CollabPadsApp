import { CHANGE_FAB, NO_FAB, SET_NAVIGATOR } from "../actions/types";

export default function navReducer(state = {fab: null, nav: null}, action){
    switch (action.type) {
      case CHANGE_FAB:
        return {
          ...state,
          fab: action.payload
        }
      case NO_FAB:
        return {
          ...state,
          fab: null
        }
      case SET_NAVIGATOR:
        return {
          ...state,
          nav: action.payload
        }
      default:
        return state
    }
}
