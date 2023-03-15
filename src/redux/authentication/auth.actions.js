import axios from 'axios';
import authActionTypes from './auth.types';
import url from '../../config/url';
export const login = (data) => async (dispatch) => {
  dispatch({ type: authActionTypes.SET_LOGIN_SUBMITTING });
  try {
    const login = await axios.post(`${url.BASE_URL}user/login`, data);
    const auth = login.data.body;
    dispatch({ type: authActionTypes.SET_LOGIN_SUBMITTING });
    dispatch({ type: authActionTypes.LOGIN, payload: auth });
  } catch (e) {
    dispatch({ type: authActionTypes.SET_LOGIN_SUBMITTING });
    if (e.response) {
      const errors = e.response.data.message;
      dispatch({ type: authActionTypes.SET_LOGIN_ERRORS, payload: errors });
      setTimeout(() => {
        dispatch({ type: authActionTypes.SET_LOGIN_ERRORS, payload: null });
      }, 6000);
    } else if (e.request) {
      alert('Cannot carry out this request at this time. Please try again');
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: authActionTypes.LOGOUT });
  } catch (e) {}
};

export const disableSubmitting = () => async (dispatch) => {
  try {
    dispatch({ type: authActionTypes.SET_LOGIN_SUBMITTING_FALSE });
  } catch (e) {}
};
