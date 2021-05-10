import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";
import OneComment from "./OneComment";
import faker from "faker";

class Comment extends Component {
  state = {
    comments: [],
  };
  generateCmtContents = () => {
    let contents = [];
    for (let i = 0; i < 10; i++) {
      let text = faker.lorem.sentences(Math.ceil(Math.random() * 3));
      let images = [
        faker.image.imageUrl(80, 80, "", true),
        faker.image.imageUrl(80, 80, "", true),
        faker.image.imageUrl(80, 80, "", true),
      ];
      contents.push({
        text: text,
        images: [...images],
      });
    }
    this.setState({
      comments: [...contents],
    });
  };
  componentDidMount() {
    this.generateCmtContents();
  }
  render() {
    return (
      <Box className="white-background" mt={2}>
        <Box p={2}>
          <big>Binh luận trên sản phẩm</big>
        </Box>
        <Divider />
        <Box pt={2}>
          {this.state.comments.map((content, index) => {
            return <OneComment content={content} key={index} />;
          })}
        </Box>
      </Box>
    );
  }
}

export default Comment;
