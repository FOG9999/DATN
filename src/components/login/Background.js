import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import LoginBox from "./LoginBox";
import RegisterBox from "./RegisterBox";

class Background extends Component {
  state = {
    showLogin: true,
  };
  switchLogin = () => {
    this.setState({
      showLogin: !this.state.showLogin,
    });
  };
  render() {
    return (
      <Container maxWidth="xl" className="login-background-container0">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py="100px"
        >
          {this.state.showLogin ? (
            <LoginBox switchLogin={this.switchLogin} />
          ) : (
            <RegisterBox switchLogin={this.switchLogin} />
          )}
        </Box>
      </Container>
    );
  }
}

export default Background;
