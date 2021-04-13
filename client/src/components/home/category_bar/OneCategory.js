import React, { Component } from "react";
import { Box } from "@material-ui/core";

class OneCategory extends Component {
  state = {};
  render() {
    return (
      <Box className="cursor-pointer home-categorybar-onecate-box1">
        <Box
          justifyContent="center"
          display="flex"
          alignItems="center"
          className="categorybar-onecate-box0 cursor-pointer"
          pt="8px"
        >
          <img
            src={this.props.cateImg}
            className="home-categorybar-onecate-img"
            alt=""
          />
        </Box>
        <Box textAlign="center" p={1}>
          {this.props.title}
        </Box>
      </Box>
    );
  }
}

export default OneCategory;
