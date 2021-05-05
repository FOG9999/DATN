const { TYPES } = require("../types/Type");

const GeneralAction = {
  loading: () => {
    return (dispatch) =>
      dispatch({
        type: TYPES.LOADING,
      });
  },
  loaded: () => {
    return (dispatch) =>
      dispatch({
        type: TYPES.LOADED,
      });
  },
};

export { GeneralAction };
