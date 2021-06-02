import { Box } from "@material-ui/core";
import React, { Component } from "react";
import SimpleHeader from "../header/SimpleHeader";
import ProductInformation from "./category/ProductInformation";

class UploadContainer extends Component {
  constructor(props) {
    super(props);
    document.title = "Đăng tải sản phẩm";
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
        <SimpleHeader title="Đăng tải sản phẩm - Cá nhân" />
        <Box className="home-box0">
          <ProductInformation />
        </Box>
      </Box>
    );
  }
}

export default UploadContainer;
