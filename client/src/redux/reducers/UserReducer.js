import { TYPES } from "../types/Type";

export const UserReducer = (
  state = {
    logged: false,
    name: "",
    cartNum: 0,
  },
  action
) => {
  switch (action.type) {
    case TYPES.LOGIN: {
      return {
        ...state,
        logged: action.logged,
        name: action.name,
        cartNum: action.cartNum,
      };
    }
    case TYPES.LOGOUT: {
      return {
        ...state,
        logged: false,
        name: "",
        cartNum: 0,
      };
    }
    case TYPES.ADDCART: {
      return {
        ...state,
        cartNum: action.cartNum,
      };
    }
    case TYPES.GETCART: {
      return {
        ...state,
        cartNum: action.cartNum,
      };
    }
    default:
      return state;
  }
};
