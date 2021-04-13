import { Box, Container } from "@material-ui/core";
import React, { Component } from "react";
import NavigationBar from "./NavigationBar/NavigationBar";

class BoothManageContainer extends Component {
  state = {
    mainComponent: null,
  };
  changeMainComponent = (component) => {
    this.setState({
      mainComponent: component,
    });
  };
  render() {
    return (
      <Box display="flex" minHeight="100%" height="fit-content">
        <NavigationBar changeMainComponent={this.changeMainComponent} />
        <Container className="grey-background">
          {this.state.mainComponent}
        </Container>
      </Box>
    );
  }
}

export default BoothManageContainer;
