import { USER_LOGIN, USER_LOGIN_SUCCESS, USER_HAS_LOGIN, USER_LOGOUT_SUCCESS, USER_DATA_SUCCESS, USER_RESET_ERRORS } from './types';
import { USER_URL, LOGOUT_URL } from '../listrUrls';

_removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Error retrieving data
  }
};

export const beginUserLogin = () => dispatch =>{
  return{
    type: USER_LOGIN
  }
}

export const resetErrors = () => dispatch =>{
  dispatch({
    type: USER_RESET_ERRORS
  });
}

export const setUserToken = (token) => dispatch => {
  if(token !== null && token !== undefined){
    dispatch({
      type: USER_HAS_LOGIN,
      payload: token
    });
  }
}

export const performRegister = (url, userData) => dispatch => {
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(key => dispatch({type: USER_LOGIN_SUCCESS, payload: key}));
}

export const getUserData = (url, token) => dispatch => {
  fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token
    },
  })
  .then(res => res.json())
  .then(data => dispatch({type: USER_DATA_SUCCESS, payload:data}));
}

export const performLogin = (url, userData) => dispatch => {
  dispatch(beginUserLogin());
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(key => dispatch({type: USER_LOGIN_SUCCESS, payload: key}))
}

export const performLogout = (url) => dispatch => {
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  })
  .then( () => {
    dispatch({type: USER_LOGOUT_SUCCESS});
  });
}

export const performNameChange = (url, userData, token) => dispatch => {
  fetch(url, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(data => {
    dispatch({type: USER_DATA_SUCCESS, payload:data});
  });
}

export const performPassChange = (url, userData, token) => dispatch => {
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify(userData)
  })
  .then(res => res.json())
  .then(data => {
    if(data.new_password2){
      alert(data.new_password2);
    }else if(data.new_password1){
      alert(data.new_password1);
    }else{
      dispatch(performLogout(LOGOUT_URL));
    }
  });
}
