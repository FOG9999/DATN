import React, { Component } from "react";
import { Box } from "@material-ui/core";

import { categories } from "../../../others/categories";

class CategoryBar extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" flexWrap="wrap">
        {categories.map((cate, index) => {
          return (
            <Box pb={2} px={2} key={index} className="color-white">
              {cate}
            </Box>
          );
        })}
      </Box>
    );
  }
}

export default CategoryBar;
