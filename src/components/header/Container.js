import React, { Component } from "react";
import { Container } from "@material-ui/core";
import HeaderButtons from "./buttons/HeaderButtons";
// import CategoryBar from "./categories/CategoryBar";
import SearchBar from "./searchbar/SearchBar";

class HeaderContainer extends Component {
  state = {};
  render() {
    return (
      <Container maxWidth="xl" className="header-container">
        <HeaderButtons />
        <SearchBar />
      </Container>
    );
  }
}

export default HeaderContainer;
