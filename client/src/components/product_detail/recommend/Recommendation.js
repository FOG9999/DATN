import React, { Component } from "react";
import { Box } from "@material-ui/core";
import OneProduct from "../../general/OneProduct";
import { getRelatedProduct } from "../../../apis/item-pool/ItemPool";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class RecommendationProduct extends Component {
  state = {
    suggestion: [],
  };
  componentDidMount() {
    getRelatedProduct(this.props.proID, (rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
      } else
        this.setState({
          suggestion: [...rs.data],
        });
    });
  }
  onClickProduct = (proID) => {
    window.location.href = "/prd/" + proID;
  };
  render() {
    return (
      <Box>
        <ToastContainer />
        <Box p={2}>
          <big className="color-aaa">Có thể bạn quan tâm</big>
        </Box>
        <Box>
          {this.state.suggestion.map((sug, index) => {
            return (
              <Box p={1} key={index} mb={1} className="white-background">
                <OneProduct
                  WIDTH={200}
                  item={sug}
                  onClickProduct={() => this.onClickProduct(sug._id)}
                />
              </Box>
            );
          })}
          {/* <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box>
          <Box p={1} mb={1} className="white-background">
            <OneProduct WIDTH={200} />
          </Box> */}
        </Box>
      </Box>
    );
  }
}

export default RecommendationProduct;
