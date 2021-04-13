import { Box } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";

class OneComment extends Component {
  state = {};
  render() {
    return (
      <Box pl={4}>
        <Box display="flex">
          <Box display="flex" alignItems="center" justifyContent="center">
            <img
              src={faker.image.imageUrl(50, 50, "fashion", true)}
              className="one-comment-user-avatar"
              alt=""
            />
          </Box>
          <Box
            ml={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <small>
              <b>{faker.name.firstName() + " " + faker.name.lastName()}</b>
            </small>
          </Box>
        </Box>
        <Box>
          <Box py={1}>{this.props.content.text}</Box>
          <Box display="flex" flexWrap="wrap">
            {this.props.content.images.map((image, index) => {
              return (
                <Box key={index} pr={1} py={1}>
                  <img src={image} className="one-comment-img-cmt" alt="" />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default OneComment;
