import { NO_FAB, CHANGE_FAB, SET_NAVIGATOR, CHANGE_FAB_FUNC } from './types';

export const changeFAB = (type) => dispatch => {
    dispatch({
      type: CHANGE_FAB,
      payload: type
    });
}

export const changeFABFunction = (func) => dispatch => {
  dispatch({
    type: CHANGE_FAB_FUNC,
    payload: func
  });
}

export const noFAB = () => dispatch => {
  dispatch({
    type: NO_FAB
  });
}

export const setNavigator = (navigator) => dispatch => {
  if(navigator !== null && navigator !== undefined){
    dispatch({
      type: SET_NAVIGATOR,
      payload: navigator
    });
  }
}
