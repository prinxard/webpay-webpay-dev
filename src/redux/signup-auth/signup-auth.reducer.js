import signUpAuthActionTypes from './signup-auth.types';
const initialState = {
  errorMessages: null,
  successMessages: null,
  isSignUpComplete: false,
  submitting: false,
  resendingToken: false,
  tokenMessage: null,
};

const signUpAuth = (state = initialState, action) => {
  switch (action.type) {
    case signUpAuthActionTypes.SIGN_UP_AUTH:
      return {
        ...state,
        successMessages: action.payload,
        isSignUpComplete: true,
      };
    case signUpAuthActionTypes.SIGN_UP_AUTH_ERRORS:
      return {
        ...state,
        errorMessages: action.payload,
      };
    case signUpAuthActionTypes.CLEAR_AUTH_STATE:
      return {
        ...state,
        errorMessages: null,
        successMessages: null,
        isSignUpComplete: false,
        submitting: false,
      };
    case signUpAuthActionTypes.SIGN_UP_AUTH_SUBMITTING:
      return {
        ...state,
        submitting: !state.submitting,
      };
    case signUpAuthActionTypes.RESET_SIGN_UP_AUTH_SUBMITTING:
      return {
        ...state,
        submitting: false,
      };
    case signUpAuthActionTypes.RESEND_TOKEN:
      return {
        ...state,
        tokenMessage: action.payload,
      };
    case signUpAuthActionTypes.RESENDING_TOKEN:
      return {
        ...state,
        resendingToken: !state.resendingToken,
      };
    case signUpAuthActionTypes.RESET_RESENDING_TOKEN:
      return {
        ...state,
        resendingToken: false,
      };

    default:
      return state;
  }
};

export default signUpAuth;
