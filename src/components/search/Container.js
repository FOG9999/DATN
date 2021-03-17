import React, { Component } from "react";
import { Box } from "@material-ui/core";
import SearchFilter from "./filter/SearchFilter";
import SearchResult from "./result/SearchResult";

class SearchContainer extends Component {
  state = {};
  render() {
    return (
      <Box display="flex">
        <SearchFilter />
        <SearchResult />
      </Box>
    );
  }
}

export default SearchContainer;
