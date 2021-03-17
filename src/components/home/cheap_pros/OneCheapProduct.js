import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";

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
        >
          <img
            src={faker.image.imageUrl(190, 190, "Fashion", true, true)}
            alt=""
          />
        </Box>
        <Box className="price" textAlign="center" pb={1}>
          đ{Math.ceil(faker.commerce.price(0, 50))}.000
        </Box>
      </Box>
    );
  }
}

export default OneCheapProduct;
