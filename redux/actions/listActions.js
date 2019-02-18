import { FETCH_LISTS, FETCH_SHARED_LISTS, FETCH_LISTS_SUCCESS, FETCH_SHARED_LISTS_SUCCESS, LIST_POST_SUCCESS, LIST_DELETE_SUCCESS } from './types';
import { SHARED_LISTS_URL } from '../listrUrls';

export const fetchLists = (url, token) => dispatch =>{
    dispatch({type: FETCH_LISTS});
    fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Token ' + token
      },
    })
    .then(res => res.json())
    .then(data => dispatch(fetchSharedLists(SHARED_LISTS_URL, data, token)));
}

export const fetchSharedLists = (url, oldData, token) => dispatch =>{
    fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Token ' + token
      },
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      dispatch({type: FETCH_LISTS_SUCCESS, lists: oldData, shared: data})
    });
}

export const deleteList = (url, listId, token) => dispatch => {
  // var csrftoken = Cookies.get('csrftoken');
  fetch(url+listId+'/', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token,
      'Guest': 'False'
    },
  })
  .then(res => {
    if(res.status === 200){
      dispatch(fetchLists(url, token));
    }else{
      console.log(res.json().detail);
    }
  });

}

export const performListPost = (url, listData, token) => dispatch => {
  // var csrftoken = Cookies.get('csrftoken');
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify(listData)
  })
  .then(res => {
    if(res.status === 201){
      dispatch(fetchLists(url, token));
    }else{
      console.log(res.json());
    }
  })
}

export const addCollab = (url, listData, listID, token) => dispatch => {
  // var csrftoken = Cookies.get('csrftoken');
  fetch(url+listID+'/', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Token ' + token,
    },
    body: JSON.stringify(listData)
  })
  .then(res => {
    if(res.status === 200){
      dispatch(fetchLists(url, token));
    }else{
      console.log(res.json().detail);
    }
  });
}
