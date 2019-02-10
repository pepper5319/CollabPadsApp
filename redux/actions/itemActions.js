import { FETCH_ITEMS, FETCH_ITEMS_SUCCESS, DISMISS_ITEMS } from './types';
import { ITEMS_URL } from '../listrUrls';
import Cookies from 'js-cookie';

export const fetchItems = (url, listID, token) => dispatch =>{
    dispatch({type: FETCH_ITEMS});
    fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Token ' + token,
        'LIST-ID': listID,
        'GUEST': 'False'
      },
    })
    .then(res => res.json())
    .then(data => dispatch({
      type: FETCH_ITEMS_SUCCESS,
      payload: data,
    }));
}

export const performItemPost = (url, itemData, listID, token) => dispatch => {
  var csrftoken = Cookies.get('csrftoken');
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token,
      'LIST-ID': listID,
      'GUEST': 'False',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify(itemData)
  })
  .then(res => {
    if(res.status === 201){
      dispatch(fetchItems(url, listID, token));
    }else{
      console.log(res.json());
    }
  })
}

export const deleteItem = (url, itemID, listID, token) => dispatch => {
  var csrftoken = Cookies.get('csrftoken');
  fetch(url+itemID+'/', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token,
      'GUEST': 'False'
    },
  })
  .then(res => {
    if(res.status === 204){
      dispatch(fetchItems(ITEMS_URL, listID, token));
    }else{
      console.log(res.json().detail);
    }
  });
}

export const likeItem = (url, itemData, listID, token) => dispatch => {
  var csrftoken = Cookies.get('csrftoken');
  fetch(url+itemData.static_id+'/', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token,
      'GUEST': 'False'
    },
    body: JSON.stringify(itemData)
  })
  .then(res => {
    if(res.status === 200){
      dispatch(fetchItems(ITEMS_URL, listID, token));
    }else{
      console.log(res.json().detail);
    }
  });
}
