import { Box, IconButton } from "@material-ui/core";
import React, { Component } from "react";
import { Close, Movie } from "@material-ui/icons";

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
      <Box m="8px" position="relative">
        <Box
          display="flex"
          flexDirection="row-reverse"
          position="absolute"
          top="0px"
          zIndex="1"
        >
          <IconButton onClick={this.props.deleteImage}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="150px"
          height="150px"
        >
          {this.props.type === "I" ? (
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
          ) : (
            <Movie
              fontSize="large"
              onClick={this.props.onClickPreviewImage}
              className="cursor-pointer"
            />
          )}
        </Box>
      </Box>
    );
  }
}

export default PreviewImage;
