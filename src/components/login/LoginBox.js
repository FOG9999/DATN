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

class LoginBox extends Component {
  state = {};
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
        <Box textAlign="center">
          <Box>
            <img src={logo} className="login-loginbox-logo" alt="" />
          </Box>
          <h1>Chợ sinh viên Hà Nội</h1>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel htmlFor="input-with-icon-adornment">
              Tên đăng nhập
            </InputLabel>
            <Input
              required="true"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel htmlFor="input-with-icon-adornment">
              Mật khẩu
            </InputLabel>
            <Input
              required="true"
              type="password"
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

export default LoginBox;
