import React, { Component } from "react";
import { Box } from "@material-ui/core";
import MainSector from "./main_sector/MainSector";
import Header from "../header/Container";
import ProductDescription from "../product_detail/details/ProductDesciption";

class ProductDetailContainer extends Component {
  state = {};
  render() {
    return (
      <Box
        maxWidth="xl"
        minWidth="1325px"
        className="home-container"
        pt="200px"
      >
        <Header />
        <Box className="home-box0">
          <ProductDescription />
        </Box>
      </Box>
    );
  }
}

export default ProductDetailContainer;
