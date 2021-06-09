import React, { Component } from "react";
import { Box } from "@material-ui/core";
import Comments from "../comments/Comments";
import RecommendationProduct from "../recommend/Recommendation";
import ProductDescription from "./ProductDescription";

class ProductDetail extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" mt={2}>
        <Box minWidth="1050px" mr={2}>
          {this.props.desc ? (
            <ProductDescription description={this.props.desc} />
          ) : null}
          <Comments prd_id={this.props.proID} />
        </Box>
        <RecommendationProduct proID={this.props.proID} />
      </Box>
    );
  }
}

export default ProductDetail;
