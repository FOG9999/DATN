import { Box, Container } from "@material-ui/core";
import React, { Component } from "react";
import NavigationBar from "./NavigationBar/NavigationBar";
import Header from "../../header/Container";

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
      <Box
        maxWidth="xl"
        minWidth="1325px"
        minHeight="100%"
        display="flex"
        flexDirection="column"
        // pt="200px"
        className="grey-background"
      >
        <Header />
        <Box display="flex" flexGrow={1} mt={2}>
          <NavigationBar changeMainComponent={this.changeMainComponent} />
          <Container className="grey-background">
            {this.state.mainComponent}
          </Container>
        </Box>
      </Box>
    );
  }
}

export default BoothManageContainer;
