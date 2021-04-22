import React, { Component } from "react";
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
import logo from "../../images/Hanoi_Buffaloes_logo.png";
import { UserAction } from "../../redux/actions/UserAction";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Redirect } from "react-router";

class LoginBox extends Component {
  state = {
    username: "",
    password: "",
  };
  onSubmitLogin = () => {
    this.props.dispatchLogin(this.state.username, this.state.password, (rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
      } else {
        window.location.href = "/";
      }
    });
  };
  onChangeInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
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
              value={this.state.username}
              onChange={this.onChangeInputChange}
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
              value={this.state.password}
              onChange={this.onChangeInputChange}
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
            onClick={this.onSubmitLogin}
          >
            <b>Login</b>
          </Button>
          <Box textAlign="center" pt={2}>
            <a href="/">Để sau</a>
          </Box>
        </Box>
        <Divider />
        <Box textAlign="center" p={2}>
          <span className="color-aaa">Chưa có tài khoản?</span>
          <span className="fake-link" onClick={this.props.switchLogin}>
            Đăng ký ngay
          </span>
        </Box>
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLogin: (username, password, done) => {
      dispatch(UserAction.login(username, password, done));
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginBox);
