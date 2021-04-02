import { Box } from "@material-ui/core";
import React, { Component } from "react";
import ProductInformation from "./category/ProductInformation";

class UploadContainer extends Component {
  state = {};
  render() {
    return (
      <Box className="home-box0">
        <ProductInformation />
      </Box>
    );
  }
}

export default UploadContainer;
