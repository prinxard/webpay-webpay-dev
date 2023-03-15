import signUpActionTypes from './signup.types';
import axios from 'axios';
import url from '../../config/url';

//sign up actions
export const signUp = (taxId) => async (dispatch) => {
  dispatch({ type: signUpActionTypes.SIGN_UP_SUBMITTING });
  try {
    const res = await axios.post(`${url.BASE_URL}user/signup`, taxId);
    const { KGTIN, tp_name } = res.data.body;
    console.log(res.data.body);
    const payload = {
      taxId: KGTIN,
      taxPayerName: tp_name,
      isValid: true,
    };
    dispatch({ type: signUpActionTypes.SIGN_UP_SUBMITTING });
    dispatch({ type: signUpActionTypes.SIGN_UP, payload });
  } catch (e) {
    dispatch({ type: signUpActionTypes.SIGN_UP_SUBMITTING });
    if (e.response) {
      let payload = e.response.data.message;
      dispatch({ type: signUpActionTypes.SIGN_UP_ERRORS, payload });
      setTimeout(() => {
        payload = null;
        dispatch({ type: signUpActionTypes.SIGN_UP_ERRORS, payload });
      }, 4000);
    } else if (e.request) {
      alert('Cannot carry out this request at this time. Please try again');
    }
  }
};

export const resetSubmitting = () => (dispatch) => {
  return dispatch({ type: signUpActionTypes.RESET_SIGN_UP_SUBMITTING });
};
export const clearSignUp = () => (dispatch) => {
  return dispatch({ type: signUpActionTypes.CLEAR_SIGN_UP });
};
