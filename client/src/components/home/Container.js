import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { AddBoxSharp } from "@material-ui/icons";
import Header from "../header/Container";
import CategoriesBar from "./category_bar/CategoriesBar";
import CheapProsBar from "./cheap_pros/CheapProsBar";
import Recommendation from "./recomendation/Recommendation";

class HomeContainer extends Component {
  state = {};
  render() {
    return (
      <Box
        maxWidth="xl"
        minWidth="1325px"
        className="home-container"
        // pt="200px"
      >
        <Header />
        <Box className="home-box0">
          <CategoriesBar />
          <CheapProsBar />
          <Recommendation />
        </Box>
      </Box>
    );
  }
}

export default HomeContainer;
