import { USER_LOGIN, USER_LOGIN_SUCCESS, USER_HAS_LOGIN, USER_LOGOUT_SUCCESS, USER_DATA_SUCCESS, USER_RESET_ERRORS } from "../actions/types";

export default function userReducer(state = {token: null, loading: false, username: null, error: null}, action){
    switch (action.type) {
      case USER_RESET_ERRORS:
        return {
          ...state,
          loading: false,
          error: null
        }
      case USER_LOGIN:
        return {
          ...state,
          loading: true
        }
      case USER_HAS_LOGIN:
        localStorage.setItem('token', action.payload);
        return {
          loading: false,
          token: action.payload
        }
      case USER_LOGIN_SUCCESS:
        if(action.payload.key){
          localStorage.setItem('token', action.payload.key);
          window.location.reload();
          return {
            loading: false,
            token: action.token
          }
        }else{
          if(action.payload.username){
            return {
              token: null,
              loading: false,
              error: action.payload.username
            }
          }
          else if(action.payload.non_field_errors){
            return {
              token: null,
              loading: false,
              error: "Could not login with username and/or password. Please try again."
            }
          }
          else if(action.payload.password1){
            return {
              token: null,
              loading: false,
              error: action.payload.password1
            }
          }
        }
      case USER_DATA_SUCCESS:
        if(action.payload.username){
          if(typeof(action.payload.username) === 'object'){
            alert(action.payload.username[0]);
          }else{
            return {
              ...state,
              loading: false,
              username: action.payload.username
            }
          }

        }else{
          alert("Something went wrong. Please try again.")
        }
      case USER_LOGOUT_SUCCESS:
        return {
          loading: false,
          token: null
        }
      default:
        return state
    }
}
