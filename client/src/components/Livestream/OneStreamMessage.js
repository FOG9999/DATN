import { Box } from "@material-ui/core";
import React, { Component } from "react";

class OneStreamMessage extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" maxWidth="80%">
        <Box p={1}>
          <img
            src={this.props.message.avatar}
            width="20px"
            height="20px"
            alt=""
            className="image-avatar"
          />
        </Box>
        <Box p={1}>
          <Box py="3px">
            {this.props.message.name} vào lúc <i>{this.props.message.time}</i>
          </Box>
          <Box
            className={
              this.props.mymessage ? "my-message-stream" : "backgroundcolor-aaa"
            }
            borderRadius="8px"
            p={1}
          >
            {this.props.message.text}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default OneStreamMessage;
