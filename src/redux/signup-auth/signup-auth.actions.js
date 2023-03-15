import signUpAuthActionTypes from './signup-auth.types';
import axios from 'axios';
import url from '../../config/url';

//sign-up-auth actions
export const signUpAuth = (data) => async (dispatch) => {
  dispatch({ type: signUpAuthActionTypes.SIGN_UP_AUTH_SUBMITTING });
  try {
    let res = await axios.post(`${url.BASE_URL}user/signup/auth`, data);
    const payload = res.data.body.message;
    dispatch({
      type: signUpAuthActionTypes.SIGN_UP_AUTH,
      payload,
    });
    dispatch({ type: signUpAuthActionTypes.SIGN_UP_AUTH_SUBMITTING });
  } catch (e) {
    dispatch({ type: signUpAuthActionTypes.SIGN_UP_AUTH_SUBMITTING });
    if (e.response) {
      let payload = e.response.data.message;
      console.log(payload);
      dispatch({ type: signUpAuthActionTypes.SIGN_UP_AUTH_ERRORS, payload });
      setTimeout(() => {
        payload = null;
        dispatch({ type: signUpAuthActionTypes.SIGN_UP_AUTH_ERRORS, payload });
      }, 4000);
    } else if (e.request) {
      alert('Cannot carry out this request at this time. Please try again');
    }
  }
};

export const resetSubmitting = () => (dispatch) => {
  return dispatch({
    type: signUpAuthActionTypes.RESET_SIGN_UP_AUTH_SUBMITTING,
  });
};
export const clearSignUpAuth = () => (dispatch) => {
  return dispatch({
    type: signUpAuthActionTypes.CLEAR_AUTH_STATE,
  });
};

// resendToken
export const resendToken = (data) => async (dispatch) => {
  dispatch({ type: signUpAuthActionTypes.RESENDING_TOKEN });
  try {
    const res = await axios.post(
      `${url.BASE_URL}user/signup/resend-token`,
      data
    );
    let payload = res.data.message;
    dispatch({ type: signUpAuthActionTypes.RESENDING_TOKEN });
    dispatch({ type: signUpAuthActionTypes.RESEND_TOKEN, payload });
    setTimeout(() => {
      payload = null;
      dispatch({ type: signUpAuthActionTypes.RESEND_TOKEN, payload });
    }, 4000);
  } catch (e) {
    dispatch({ type: signUpAuthActionTypes.RESENDING_TOKEN });
    if (e.request) {
      alert('Cannot carry out this request at this time. Please try again');
    }
  }
};
