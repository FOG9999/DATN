import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";

const WIDTH = 175;

class OneProduct extends Component {
  state = {};
  render() {
    return (
      <Box width={`${WIDTH}px`} className="white-background onepro">
        <Box justifyContent="center" display="flex" alignItems="center">
          <img
            src={faker.image.imageUrl(WIDTH, WIDTH, "Fashion", true, true)}
            alt=""
          />
        </Box>
        <Box p="5px" height="40px">
          {faker.commerce.productName()}
        </Box>
        <Box p="5px" className="color-aaa">
          {faker.address.streetName() + ", " + faker.address.state.name}
        </Box>
        <Box className="price" textAlign="center" pb={1}>
          đ{Math.ceil(faker.commerce.price(0, 100))}.000
        </Box>
      </Box>
    );
  }
}

export default OneProduct;
