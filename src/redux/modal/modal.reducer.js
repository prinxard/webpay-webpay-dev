import ModalActionTypes from "./modal.types";
const initialState = {
  input: true,
  hidden: false,
  backdrop: true,
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case ModalActionTypes.TOGGLE_MODAL:
      return {
        ...state,
        hidden: !state.hidden,
        input: !state.input,
        backdrop: !state.backdrop,
      };
    default:
      return state;
  }
};

export default modal;
