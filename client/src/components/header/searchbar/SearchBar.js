import React, { Component } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  TextField,
} from "@material-ui/core";
import { Search, Menu } from "@material-ui/icons";

import logo from "../../../images/Hanoi_Buffaloes_logo.png";
import CategoryBar from "../categories/CategoryBar";

class SearchBar extends Component {
  state = {
    winWidth: window.innerWidth,
  };
  updateDimension = () => {
    this.setState({
      winWidth: window.innerWidth,
    });
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimension);
  }
  render() {
    return (
      <Box display="flex" width="100%">
        <Box p={2} display="flex" alignItems="center">
          <img src={logo} alt="" className="header-searchbar-logo" />
        </Box>
        <Box py={2} px={2} my="auto" width="70%">
          <Paper component="form" className="header-searchbar-paper">
            <IconButton aria-label="menu">
              <Menu />
            </IconButton>
            <InputBase
              placeholder="Search"
              className="header-searchbar-inputbase"
            />
            {this.state.winWidth < 1000 && this.state.winWidth > 550 ? (
              <IconButton type="submit">
                <Search />
              </IconButton>
            ) : null}
          </Paper>
          {this.state.winWidth >= 1000 ? <CategoryBar /> : null}
        </Box>
        {this.state.winWidth >= 1000 ? (
          <Box px={3} py={3}>
            <Button variant="contained" color="primary">
              <Search fontSize="large" />
            </Button>
          </Box>
        ) : null}
      </Box>
    );
  }
}

export default SearchBar;
