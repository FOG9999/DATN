const { TYPES } = require("../types/Type");

const GeneralReducer = (
  state = {
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case TYPES.LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case TYPES.LOADED: {
      return {
        ...state,
        loading: false,
      };
    }
    default:
      return state;
  }
};

export { GeneralReducer };
