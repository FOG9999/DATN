import { Box, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { Component } from "react";

const maxWidth = 1100,
  maxHeight = 500;

class MainImgModal extends Component {
  state = {
    width:
      this.props.main.width >= 2 * this.props.main.height
        ? maxWidth
        : (this.props.main.width * maxHeight) / this.props.main.height,
    height:
      this.props.main.width >= 2 * this.props.main.height
        ? (this.props.main.height * maxWidth) / this.props.main.width
        : maxHeight,
  };
  render() {
    return (
      <Box
        minWidth="100%"
        minHeight={`${window.screen.height}px`}
        className="background-modal-img-upload"
        position="fixed"
        zIndex="100"
        top="0px"
        left="0px"
      >
        <Box display="flex" flexDirection="row-reverse">
          <IconButton onClick={this.props.close}>
            <Close />
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          py="20px"
        >
          {this.props.type === "I" ? (
            <img
              src={this.props.main.src}
              style={{
                width: this.state.width,
                height: this.state.height,
                opacity: "1",
              }}
              alt=""
            />
          ) : (
            <video
              controls
              muted
              src={this.props.main.src}
              width={this.props.main.width}
              height={this.props.main.height}
            ></video>
          )}
        </Box>
      </Box>
    );
  }
}

export default MainImgModal;
