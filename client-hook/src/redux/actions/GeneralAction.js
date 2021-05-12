import { TYPE } from "../type/Type";

const GeneralAction = {
  loading: () => {
    return (dispatch) => {
      dispatch({
        type: TYPE.LOADING,
      });
    };
  },
  loaded: () => {
    return (dispatch) => {
      dispatch({
        type: TYPE.LOADED,
      });
    };
  },
};

export { GeneralAction };
