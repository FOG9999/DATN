import React, { Component } from "react";
import { Box } from "@material-ui/core";

class OneDirection extends Component {
  state = {};
  render() {
    return (
      <Box
        display="flex"
        className="div-hover-aaa"
        style={
          this.props.selected
            ? { backgroundColor: "rgb(238, 77, 46)", color: "white" }
            : {}
        }
        p={2}
        pl="40px"
        alignItems="center"
        className="cursor-pointer"
        onClick={this.props.onClick}
      >
        {this.props.direction.icon}
        <Box ml={1}>{this.props.direction.content}</Box>
      </Box>
    );
  }
}

export default OneDirection;
