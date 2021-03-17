import { Box, Checkbox } from "@material-ui/core";
import React, { Component } from "react";

class RecommendKeyWords extends Component {
  state = {};
  render() {
    return (
      <Box>
        <Box pt={1} px={2}>
          Từ khóa đề xuất
        </Box>
        <Box>
          <ul className="list-style-type-none">
            {this.props.keywords.map((keyword, index) => {
              return (
                <li key={index} className="padding-block-start-zero">
                  <Checkbox /> <span>{keyword}</span>
                </li>
              );
            })}
          </ul>
        </Box>
      </Box>
    );
  }
}

export default RecommendKeyWords;
