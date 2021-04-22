import { TYPES } from "../types/Type";

export const UserReducer = (
  state = {
    logged: false,
    name: "",
  },
  action
) => {
  switch (action.type) {
    case TYPES.LOGIN: {
      return {
        ...state,
        logged: action.logged,
        name: action.name,
      };
    }
    case TYPES.LOGOUT: {
      return {
        ...state,
        logged: false,
        name: "",
      };
    }
    default:
      return state;
  }
};
