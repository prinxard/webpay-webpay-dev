import { configActionTypes } from "./config.types";
const initialState = {
  name: "KGIRS",
  description: "KGIRS eTax Portal",
  url: "/",
  layout: "layout-1",
  collapsed: true,
  rightSidebar: false,
  backdrop: false,
};

export const config = (state = initialState, action) => {
  switch (action.type) {
    case configActionTypes.SET_CONFIG:
      return {
        ...state,
        ...action.config,
      };
    case configActionTypes.SET_CONFIG_KEY:
      return {
        ...state,
        [`${action.key}`]: action.value,
      };
    default:
      return state;
  }
};
