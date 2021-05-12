import { TYPE } from "../type/Type";

const GeneralReducer = (
  state = {
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case TYPE.LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case TYPE.LOADED: {
      return {
        ...state,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
};

export { GeneralReducer };
