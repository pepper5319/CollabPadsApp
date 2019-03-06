import { NO_FAB, CHANGE_FAB, SET_NAVIGATOR } from './types';

export const changeFAB = (type) => dispatch => {
    dispatch({
      type: CHANGE_FAB,
      payload: type
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
