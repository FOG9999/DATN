import { Box, Button, Divider } from "@material-ui/core";
import React, { Component } from "react";
import OneCheapProduct from "./OneCheapProduct";
import right from "../../../images/right.png";
import { rcmCheapPros } from "../../../apis/item-pool/ItemPool";

class OneProduct extends Component {
  state = {
    cheaps: [],
  };
  componentDidMount() {
    rcmCheapPros().then((rs) => {
      this.setState({
        cheaps: [...rs.data.products],
      });
    });
  }
  render() {
    return (
      <Box className="white-background" mt={1}>
        <Box p={2} className="color-orange">
          <big>GIÁ RẺ TUẦN NÀY</big>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="center">
          <Box display="flex" alignItems="center">
            <button className="direction-btn">
              <img src={right} className="direct-img left-direction" alt="" />
            </button>
          </Box>
          {this.state.cheaps.map((cheap, ind) => {
            return <OneCheapProduct pro={cheap} key={ind} />;
          })}
          <Box display="flex" alignItems="center">
            <button className="direction-btn">
              <img src={right} className="direct-img right-direction" alt="" />
            </button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default OneProduct;
