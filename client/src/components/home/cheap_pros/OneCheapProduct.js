import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";
import { turnNumberToNumberWithSeperator } from "../../../others/functions/checkTextForNumberInput";

class OneCheapProduct extends Component {
  state = {};
  render() {
    return (
      <Box>
        <Box
          className="cursor-pointer"
          justifyContent="center"
          display="flex"
          alignItems="center"
          p={1}
          onClick={() => (window.location.href = "/prd/" + this.props.pro._id)}
        >
          <img
            src={this.props.pro.images[0].link}
            alt=""
            style={{ width: "190px", height: "190px" }}
          />
        </Box>
        <Box className="price" textAlign="center" pb={1}>
          đ{turnNumberToNumberWithSeperator(this.props.pro.price)}
        </Box>
      </Box>
    );
  }
}

export default OneCheapProduct;
