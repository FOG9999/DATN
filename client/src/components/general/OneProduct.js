import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";

const WIDTH = 175;

class OneProduct extends Component {
  state = {};
  render() {
    return (
      <Box
        width={`${this.props.WIDTH + 10}px`}
        className="white-background onepro"
      >
        <Box
          justifyContent="center"
          display="flex"
          alignItems="center"
          className="onepro-image-box"
        >
          <img
            src={faker.image.imageUrl(
              this.props.WIDTH,
              this.props.WIDTH,
              "Fashion",
              true,
              true
            )}
            alt=""
          />
        </Box>
        <Box p="5px" height="40px">
          {this.props.item
            ? this.props.item.title
            : faker.commerce.productName()}
        </Box>
        <Box p="5px" className="color-aaa">
          {this.props.item
            ? this.props.item.location.detail +
              "," +
              this.props.item.location.street +
              "," +
              this.props.item.location.district +
              "," +
              "Hà Nội"
            : faker.address.streetName() + ", " + faker.address.state.name}
        </Box>
        <Box className="price" textAlign="center" pb={1}>
          đ{Math.ceil(faker.commerce.price(0, 100))}.000
        </Box>
      </Box>
    );
  }
}

export default OneProduct;
