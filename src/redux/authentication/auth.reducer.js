import authActionTypes from './auth.types';
const initialState = {
  auth: false,
  submitting: false,
  loginErrors: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case authActionTypes.LOGIN:
      return {
        ...state,
        auth: action.payload,
        loginErrors: null,
      };
    case authActionTypes.LOGOUT:
      return {
        ...state,
        auth: false,
        loginErrors: null,
      };
    case authActionTypes.SET_LOGIN_ERRORS:
      return {
        ...state,
        loginErrors: action.payload,
      };
    case authActionTypes.SET_LOGIN_SUBMITTING:
      return {
        ...state,
        submitting: !state.submitting,
      };
    case authActionTypes.SET_LOGIN_SUBMITTING_FALSE:
      return {
        ...state,
        submitting: false,
      };

    default:
      return state;
  }
};

export default auth;
