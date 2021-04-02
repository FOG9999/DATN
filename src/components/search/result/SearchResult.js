import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";
import OneProduct from "../../general/OneProduct";

const genNumOfItems = () => {
  let items = [];
  for (let i = 0; i < 30; i++) {
    items.push(true);
  }
  return items;
};

class Recomendation extends Component {
  state = {};
  render() {
    return (
      <Box mt={2}>
        <Box p={2} className="white-background color-orange">
          <big>KẾT QUẢ TÌM KIẾM CHO BẠN</big>
        </Box>
        <Divider />
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {genNumOfItems().map((item, index) => {
            return <OneProduct WIDTH={175} />;
          })}
        </Box>
      </Box>
    );
  }
}

export default Recomendation;
