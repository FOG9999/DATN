import { Box } from "@material-ui/core";
import React, { Component } from "react";
import SimpleHeader from "../../header/SimpleHeader";
import BoothRegister from "./BoothRegister";

class BoothRegisterContainer extends Component {
  constructor(props) {
    super(props);
    document.title = "Tạo gian hàng";
  }
  state = {};
  render() {
    return (
      <Box
        maxWidth="xl"
        minWidth="1325px"
        className="home-container"
        // pt="200px"
      >
        <SimpleHeader title="Tạo gian hàng" />
        <Box className="home-box0">
          <BoothRegister />
        </Box>
      </Box>
    );
  }
}

export default BoothRegisterContainer;
