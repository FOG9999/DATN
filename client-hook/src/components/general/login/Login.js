import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  InputAdornment,
  InputLabel,
  FormControl,
  Divider,
} from "@material-ui/core";
import { AccountCircle, Lock } from "@material-ui/icons";
import logo from "../../../images/Hanoi_Buffaloes_logo.png";
import { UserAction } from "../../../redux/actions/UserAction";
// import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../Loading";
// import { Redirect } from "react-router";

function LoginBox() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const loading = useSelector((state) => state.general.loading);
  const dispatch = useDispatch();

  function onSubmitLogin() {
    dispatch(GeneralAction.loading());
    dispatch(
      UserAction.login(user.username, user.password, (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          dispatch(GeneralAction.loaded());
        } else {
          window.location.href = "/admin";
        }
      })
    );
  }
  function onChangeInputChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }
  if (loading)
    return (
      <Box>
        <ToastContainer />
        <Loading />
      </Box>
    );
  else
    return (
      <Box
        display="flex"
        justifyContent="center"
        px={2}
        py={3}
        className="login-loginbox-box0"
        flexDirection="column"
      >
        <ToastContainer />
        <Box textAlign="center">
          <Box>
            <img src={logo} className="login-loginbox-logo" alt="" />
          </Box>
          <h1>Chợ sinh viên Hà Nội</h1>
        </Box>
        <Box p={3}>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="input-with-icon-adornment">
              Tên đăng nhập
            </InputLabel>
            <Input
              value={user.username}
              onChange={onChangeInputChange}
              name="username"
              required={true}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box p={3}>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="input-with-icon-adornment">
              Mật khẩu
            </InputLabel>
            <Input
              required={true}
              type="password"
              name="password"
              value={user.password}
              onChange={onChangeInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box p={3}>
          <Button
            fullWidth={true}
            className="login-loginbox-buttonlogin"
            mb={1}
            color="primary"
            variant="contained"
            onClick={onSubmitLogin}
          >
            <b>Login</b>
          </Button>
        </Box>
        <Divider />
        <Box textAlign="center" p={2}>
          <span className="color-aaa">
            Hệ thống đăng nhập cho những người quản lý website
          </span>
        </Box>
      </Box>
    );
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     dispatchLogin: (username, password, done) => {
//       dispatch(UserAction.login(username, password, done));
//     },
//   };
// };

// export default connect(null, mapDispatchToProps)(LoginBox);
export default LoginBox;
