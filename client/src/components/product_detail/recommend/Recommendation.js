import React, { Component } from "react";
import { Box } from "@material-ui/core";
import OneProduct from "../../general/OneProduct";

class RecommendationProduct extends Component {
  state = {};
  render() {
    return (
      <Box>
        <Box p={2}>
          <big className="color-aaa">Có thể bạn quan tâm</big>
        </Box>
        <Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default RecommendationProduct;
