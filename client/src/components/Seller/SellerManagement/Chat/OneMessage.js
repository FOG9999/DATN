import { Box } from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";
import React, { Component } from "react";

class OneMessage extends Component {
  state = {};
  render() {
    return (
      <Box
        display="flex"
        py={1}
        px={2}
        flexDirection={this.props.me ? "row-reverse" : "row"}
      >
        {this.props.message.showAvatar ? (
          <Box display="flex" alignItems="center">
            <img
              src={this.props.message.sender.avatar}
              width="20px"
              height="20px"
              alt=""
              className="image-avatar"
            />
          </Box>
        ) : (
          <Box width="20px"></Box>
        )}
        <Box
          p={1}
          borderRadius="5px"
          mx={1}
          maxWidth="50%"
          className="backgroundcolor-aaa color-white"
        >
          <Box pb="5px" display="flex" flexDirection="flex-end" flexWrap="wrap">
            {this.props.message.files.map((file, index) => {
              return !file.link.includes("mp4") ||
                !file.link.includes("webm") ? (
                <img
                  src={file.link}
                  alt=""
                  width="50px"
                  height="50px"
                  key={index}
                />
              ) : (
                <video
                  controls
                  key={index}
                  width="250px"
                  height="250px"
                  src={file.link}
                ></video>
              );
            })}
          </Box>
          <Box>{this.props.message.text}</Box>
        </Box>
      </Box>
    );
  }
}

export default OneMessage;
