import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";

class ProductDescription extends Component {
  state = {};
  render() {
    return (
      <Box className="white-background">
        <Box p={2}>
          <big>Mô tả sản phẩm</big>
        </Box>
        <Divider />
        <Box p={2}>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.description,
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default ProductDescription;
