import React, { Component } from "react";
import { Box } from "@material-ui/core";
import Comments from "../comments/Comments";
import RecommendationProduct from "../recommend/Recommendation";

class ProductDetail extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" mt={2}>
        <Box minWidth="1050px" className="white-background" mr={2}>
          <Comments />
        </Box>
        <RecommendationProduct proID={this.props.proID} />
      </Box>
    );
  }
}

export default ProductDetail;
