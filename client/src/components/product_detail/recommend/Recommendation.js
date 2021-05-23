import React, { Component } from "react";
import { Box } from "@material-ui/core";
import OneProduct from "../../general/OneProduct";
import {
  // getPrdByID,
  getPrdForRelate,
  getRelatedProduct,
} from "../../../apis/item-pool/ItemPool";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class RecommendationProduct extends Component {
  state = {
    suggestion: [],
  };
  componentDidMount() {
    getPrdForRelate(this.props.proID, (rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        setTimeout(() => (window.location.href = "/"), 3000);
      } else {
        getRelatedProduct(rs.data[0].type, 5, rs.data[0].category, (rs1) => {
          if (rs1.EC !== 0) {
            toast.error(rs1.EM);
          } else
            this.setState({
              suggestion: [...rs1.data.suggestion],
            });
        });
        // this.props.dispatchLoaded();
      }
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
