import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";

const WIDTH = 175;

class OneProduct extends Component {
  state = {};
  onClickProduct = () => {
    this.props.onClickProduct();
  };
  render() {
    return (
      <Box
        width={`${this.props.WIDTH + 10}px`}
        className="white-background onepro"
        onClick={this.onClickProduct}
      >
        <Box
          justifyContent="center"
          display="flex"
          alignItems="center"
          className="onepro-image-box"
        >
          <img
            src={
              this.props.item
                ? this.props.item.images[0].link
                : faker.image.imageUrl(
                    this.props.WIDTH,
                    this.props.WIDTH,
                    "Fashion",
                    true,
                    true
                  )
            }
            alt=""
            className="one-product-general"
          />
        </Box>
        <Box p="5px" height="75px">
          <small>
            {this.props.item
              ? this.props.item.title
              : faker.commerce.productName()}
          </small>
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
          đ{turnNumberToNumberWithSeperator(this.props.item.price)}
        </Box>
      </Box>
    );
  }
}

export default OneProduct;
