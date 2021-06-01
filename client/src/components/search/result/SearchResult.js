import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
// import { searchNoCookie } from "../../../apis/item-pool/ItemPool";
// import { getCookie } from "../../../others/functions/Cookie";
// import { GeneralAction } from "../../../redux/actions/GeneralAction";
// import { UserAction } from "../../../redux/actions/UserAction";
import Loading from "../../general/Loading";
import OneProduct from "../../general/OneProduct";

class Recomendation extends Component {
  state = {};
  onClickProduct = (proID) => {
    window.location.href = "/prd/" + proID;
  };
  render() {
    if (this.props.loading)
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    else
      return (
        <Box mt={2} flexGrow={1}>
          <Box p={2} className="white-background color-orange">
            <big>KẾT QUẢ TÌM KIẾM CHO {`\"${this.props.keyword}\"`}</big>
          </Box>
          <Divider />
          {this.props.products.length ? (
            <Box display="flex" flexWrap="wrap" justifyContent="center">
              {this.props.products.map((item, index) => {
                return (
                  <OneProduct
                    item={item}
                    key={index}
                    WIDTH={200}
                    onClickProduct={() => this.onClickProduct(item._id)}
                  />
                );
              })}
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="50%"
            >
              <h2>Không tìm thấy sản phẩm nào</h2>
            </Box>
          )}
        </Box>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
    loading: state.general.loading,
  };
};

export default connect(mapStateToProps, null)(Recomendation);
