import { TYPE } from "../type/Type";

const UserReducer = (
  state = {
    logged: false,
    name: "",
  },
  action
) => {
  switch (action.type) {
    case TYPE.LOGIN: {
      return {
        ...state,
        logged: true,
        name: action.name,
      };
    }
    case TYPE.LOGOUT: {
      return {
        ...state,
        logged: false,
        name: "",
      };
    }
    default: {
      return state;
    }
  }
};

export { UserReducer };
