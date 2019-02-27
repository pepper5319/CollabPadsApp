import { FETCH_LISTS, FETCH_SHARED_LISTS, FETCH_LISTS_SUCCESS, FETCH_SHARED_LISTS_SUCCESS } from "../actions/types";

export default function listReducer(state = {data: [], loading: true}, action){
    switch (action.type) {
      case FETCH_LISTS:
        return {
          ...state,
          loading: true
        }
      case FETCH_LISTS_SUCCESS:
        if(action.shared.detail){
          return {
            error: action.shared.detail,
            loading: false
          }
        }else{
          console.log(action.lists);
          return {
            data: action.lists,
            sharedData: action.shared,
            loading: false,
          }
        }

      default:
        return state
    }
}
