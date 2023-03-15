import signUpActionTypes from './signup.types';
const initialState = {
  taxId: '',
  taxPayerName: '',
  isValid: false,
  errorMessages: null,
  successMessages: null,
  submitting: false,
};

const signUp = (state = initialState, action) => {
  switch (action.type) {
    case signUpActionTypes.SIGN_UP:
      return {
        ...state,
        taxId: action.payload.taxId,
        taxPayerName: action.payload.taxPayerName,
        isValid: true,
      };
    case signUpActionTypes.SIGN_UP_ERRORS:
      return {
        ...state,
        errorMessages: action.payload,
        taxId: '',
        taxPayerName: '',
        isValid: false,
      };
    case signUpActionTypes.CLEAR_SIGN_UP:
      return {
        ...state,
        taxId: '',
        taxPayerName: '',
        isValid: false,
        errorMessages: null,
        successMessages: null,
        submitting: false,
      };
    case signUpActionTypes.SIGN_UP_SUBMITTING:
      return {
        ...state,
        submitting: !state.submitting,
      };
    case signUpActionTypes.RESET_SIGN_UP_SUBMITTING:
      return {
        ...state,
        submitting: false,
      };

    default:
      return state;
  }
};

export default signUp;
