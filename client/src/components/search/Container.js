import React, { Component } from "react";
import { Box } from "@material-ui/core";
import SearchFilter from "./filter/SearchFilter";
import SearchResult from "./result/SearchResult";
import HeaderContainer from "../header/Container";

class SearchContainer extends Component {
  state = {};
  render() {
    return (
      // <Box display="flex">
      //   <SearchFilter />
      //   <SearchResult
      //     keyword={this.props.match.params.keyword}
      //     limit={this.props.match.params.limit}
      //   />
      // </Box>
      <Box
        maxWidth="xl"
        minWidth="1325px"
        className="home-container"
        // pt="200px"
      >
        <HeaderContainer />
        <Box className="home-box0" display="flex">
          <SearchFilter />
          <SearchResult
            keyword={this.props.match.params.keyword}
            limit={this.props.match.params.limit}
          />
        </Box>
      </Box>
    );
  }
}

export default SearchContainer;
