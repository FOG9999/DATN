import { Box, Button, Divider } from "@material-ui/core";
import React, { Component } from "react";
import OneCheapProduct from "./OneCheapProduct";
import right from "../../../images/right.png";

class OneProduct extends Component {
  state = {};
  render() {
    return (
      <Box className="white-background" mt={1}>
        <Box p={2}>
          <big>GIÁ RẺ TUẦN NÀY</big>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="center">
          <Box display="flex" alignItems="center">
            <button className="direction-btn">
              <img src={right} className="direct-img left-direction" alt="" />
            </button>
          </Box>
          <OneCheapProduct />
          <OneCheapProduct />
          <OneCheapProduct />
          <OneCheapProduct />
          <OneCheapProduct />
          <OneCheapProduct />
          <Box display="flex" alignItems="center">
            <button className="direction-btn">
              <img src={right} className="direct-img right-direction" alt="" />
            </button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default OneProduct;
