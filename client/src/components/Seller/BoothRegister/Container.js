import { Box } from "@material-ui/core";
import React, { Component } from "react";
import BoothRegister from "./BoothRegister";

class BoothRegisterContainer extends Component {
  state = {};
  render() {
    return (
      <Box className="home-box0">
        <BoothRegister />
      </Box>
    );
  }
}

export default BoothRegisterContainer;
