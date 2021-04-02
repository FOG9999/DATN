import { Box } from "@material-ui/core";
import React, { Component } from "react";

const maxLen = 150;

class PreviewImage extends Component {
  state = {
    size: {
      width:
        this.props.width >= this.props.height
          ? maxLen
          : Math.round((maxLen * this.props.height) / this.props.width),
      height:
        this.props.width >= this.props.height
          ? Math.round((maxLen * this.props.height) / this.props.width)
          : maxLen,
    },
  };
  render() {
    return (
      <Box
        display="flex"
        alignItems="center"
        m="8px"
        justifyContent="center"
        width="150px"
        height="150px"
      >
        <img
          src={this.props.src}
          style={{
            width: `${this.state.size.width}px`,
            height: `${this.state.size.height}px`,
          }}
          alt=""
          onClick={this.props.onClickPreviewImage}
          className="cursor-pointer"
        />
      </Box>
    );
  }
}

export default PreviewImage;
