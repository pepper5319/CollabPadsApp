import { TRYING_LIST_POST, LIST_POST_SUCCESS, FETCH_LISTS, FETCH_SHARED_LISTS, FETCH_LISTS_SUCCESS, FETCH_SHARED_LISTS_SUCCESS, FETCH_SINGLE_LIST_SUCCESS } from "../actions/types";

export default function listReducer(state = {data: null, sharedData: null, list: null, successfulPost: false, loading: true}, action){
    switch (action.type) {
      case TRYING_LIST_POST:
        return {
          ...state,
          successfulPost: false
        }
      case LIST_POST_SUCCESS:
        console.log("SUCCESS");
        return {
          ...state,
          successfulPost: true
        }
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
          console.log(action.shared);
          return {
            data: action.lists,
            sharedData: action.shared,
            loading: false,
          }
        }

      case FETCH_SINGLE_LIST_SUCCESS:
        if(action.list.detail){
          return {
            error: action.list.detail,
            loading: false
          }
        }else{
          return {
            list: action.list,
            sharedData: action.shared,
            loading: false,
          }
        }

      default:
        return state
    }
}
