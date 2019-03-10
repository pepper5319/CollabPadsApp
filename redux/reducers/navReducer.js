import { CHANGE_FAB, NO_FAB, SET_NAVIGATOR, CHANGE_FAB_FUNC } from "../actions/types";

export default function navReducer(state = {fab: null, nav: null, fabFunction: null}, action){
    switch (action.type) {
      case CHANGE_FAB:
        return {
          ...state,
          fab: action.payload
        }
      case CHANGE_FAB_FUNC:
        return {
          ...state,
          fabFunction: action.payload
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
