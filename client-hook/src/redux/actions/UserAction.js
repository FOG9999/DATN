import { AdminPool } from "../../apis/AdminPool";
import { UserPool } from "../../apis/UserPool";
import { TYPE } from "../type/Type";

const UserAction = {
  login: (username, password, done) => {
    return (dispatch) => {
      AdminPool.login(username, password, (rs) => {
        if (rs.EC === 0) {
          const { user_id, h_token, name } = rs.data;
          document.cookie = `user_id=${user_id};path=/`;
          document.cookie = `h_token=${h_token};path=/`;
          // console.log(cartNum);
          dispatch({
            type: TYPE.LOGIN,
            logged: true,
            name: name,
          });
        } else {
          dispatch({
            type: TYPE.LOGIN,
            logged: false,
            name: "",
          });
          document.cookie = "user_id=;path=/";
          document.cookie = "h_token=;path=/";
          document.cookie = "h_msg=;path=/";
        }
        done({
          EC: rs.EC,
          EM: rs.EM,
        });
      });
    };
  },
  authen: (path, method, done) => {
    return (dispatch) => {
      UserPool.authen(path, method, (rs) => {
        if (rs.EC !== 0) {
          dispatch({
            type: TYPE.LOGOUT,
            logged: false,
            name: "",
          });
        } else {
          document.cookie = "h_msg=" + rs.h_msg + ";path=/";
          done(rs);
        }
      });
    };
  },
};

export { UserAction };
