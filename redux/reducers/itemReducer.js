import { FETCH_ITEMS, FETCH_ITEMS_SUCCESS, DISMISS_ITEMS } from "../actions/types";

export default function itemReducer(state = {items: [], showModal: false, loading: true}, action){
    switch (action.type) {
      case DISMISS_ITEMS:
        console.log("CLEARING");
        return {
          ...state,
          loading: false,
          items: []
        }
      case FETCH_ITEMS:
        return {
          ...state,
          loading: true,
          showModal: false,
        }
      case FETCH_ITEMS_SUCCESS:
        console.log(action.payload);
        return {
          loading: false,
          items: action.payload,
          showModal: action.showModal
        }
      default:
        return state
    }
}
