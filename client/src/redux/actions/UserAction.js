import { TYPES } from "../types/Type";
import { authen, login, register, logout } from "../../apis/user-pool/UserPool";

const UserAction = {
  login: (username, password, done) => {
    return (dispatch) => {
      login(username, password, (rs) => {
        if (rs.EC === 0) {
          const { user_id, h_token, name, cartNum } = rs.data;
          document.cookie = `user_id=${user_id};path=/`;
          document.cookie = `h_token=${h_token};path=/`;
          // console.log(cartNum);
          dispatch({
            type: TYPES.LOGIN,
            logged: true,
            name: name,
            cartNum: cartNum,
          });
        } else {
          dispatch({
            type: TYPES.LOGIN,
            logged: false,
            name: "",
            cartNum: 0,
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
      authen(path, method, (rs) => {
        if (rs.EC !== 0) {
          dispatch({
            type: TYPES.LOGIN,
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
  register: (
    username,
    password,
    name,
    phone,
    address,
    interest,
    birthday,
    done
  ) => {
    return (dispatch) => {
      register(
        username,
        password,
        name,
        phone,
        address,
        interest,
        birthday,
        (rs) => {
          if (rs.EC === 0) {
            const { user_id, h_token, name } = rs.data;
            document.cookie = `user_id=${user_id};path=/`;
            document.cookie = `h_token=${h_token};path=/`;
            dispatch({
              type: TYPES.LOGIN,
              logged: true,
              name: name,
            });
          } else {
            dispatch({
              type: TYPES.LOGIN,
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
        }
      );
    };
  },
  logout: (done) => {
    return (dispatch) => {
      logout((rs) => {
        if (rs.EC === 0) {
          document.cookie = "user_id=;path=/";
          document.cookie = "h_token=;path=/";
          document.cookie = "h_msg=;path=/";
          dispatch({
            type: TYPES.LOGOUT,
          });
        }
        done(rs);
      });
    };
  },
  addToCart: (cartNum) => {
    return (dispatch) =>
      dispatch({
        type: TYPES.ADDCART,
        cartNum: cartNum,
      });
  },
  getCart: (cartNum) => {
    return (dispatch) => {
      dispatch({
        type: TYPES.GETCART,
        cartNum: cartNum,
      });
    };
  },
};

export { UserAction };
