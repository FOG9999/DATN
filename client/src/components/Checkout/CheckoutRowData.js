import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";
import { connect } from "react-redux";
// import { GeneralAction } from "../../redux/actions/GeneralAction";
import Loading from "../../components/general/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Checkbox,
  Select,
  // FormControl,
  // FormControlLabel,
  //   IconButton,
  //   Radio,
  //   RadioGroup,
} from "@material-ui/core";
// import {
//   Add,
//   // ArrowForwardIos,
//   // LocalShipping,
//   // PlusOneOutlined,
//   Remove,
// } from "@material-ui/icons";
// import ModalChangeLocation from "../general/modal-location/ModalChangeLocation";
import cNd from "../../others/convincesAndDistricts.json";
// import faker from 'faker'

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

// const strings = {
//   overLimit: "Vượt quá số lượng hàng đang có",
//   onlyNumber: "Chỉ được nhập số",
// };

class CheckoutRowData extends Component {
  state = {
    orderQuantity: this.props.orderProduct.order_quantity,
    selectedMethod: "PayPal",
  };
  onClickLink = () => {
    window.location.href = "/prd/" + this.props.orderProduct.product._id;
  };
  render() {
    if (!this.props.loading)
      return (
        <Box mt={2} className="white-background">
          <ToastContainer />
          <Box display="flex">
            <Box py={1} px={2} width="30px" height="30px">
              <img
                src={this.props.orderProduct.product.seller.avatar}
                width="100%"
                height="100%"
                alt=""
                className="image-avatar"
              />
            </Box>
            <Box display="flex" alignItems="center">
              {this.props.orderProduct.product.seller.name}
            </Box>
          </Box>
          <Box display="flex" borderBottom="1px solid #e8e8e8" py={2}>
            <Box display="flex" width="50%" alignItems="center">
              <Box display="flex" justifyContent="center" width="25%">
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={this.props.orderProduct.product.images[0].link}
                  alt=""
                />
              </Box>
              <Box flexGrow="1">
                <Box p={1}>
                  <span className="cursor-pointer" onClick={this.onClickLink}>
                    <b>{this.props.orderProduct.product.title}</b>
                  </span>
                </Box>
                <Box display="flex" py={1}>
                  <Box pr={4} display="flex" alignItems="center">
                    Tới
                  </Box>
                  <Box pr={4} display="flex" alignItems="center">
                    {this.props.orderProduct.delivery_location.detail}, đường{" "}
                    {
                      convincesAndDistricts[1].districts[
                        this.props.orderProduct.delivery_location.districtIndex
                      ].streets[
                        this.props.orderProduct.delivery_location.streetIndex
                      ].name
                    }
                    , quận{" "}
                    {
                      convincesAndDistricts[1].districts[
                        this.props.orderProduct.delivery_location.districtIndex
                      ].name
                    }
                    , thành phố Hà Nội
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              width="15%"
              justifyContent="center"
              alignItems="center"
            >
              {turnNumberToNumberWithSeperator(
                this.props.orderProduct.product.price
              )}
              &nbsp;VND
            </Box>
            <Box
              width="10%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                {this.state.orderQuantity}
              </Box>
            </Box>
            <Box
              display="flex"
              width="15%"
              justifyContent="center"
              alignItems="center"
            >
              {turnNumberToNumberWithSeperator(
                this.props.orderProduct.product.price * this.state.orderQuantity
              )}
              &nbsp;VND
            </Box>
            <Box
              display="flex"
              width="13%"
              justifyContent="center"
              alignItems="center"
            >
              {turnNumberToNumberWithSeperator(this.props.shipFee)}VND
            </Box>
          </Box>
        </Box>
      );
    else return <Loading />;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.general.loading,
    name: state.user.name,
  };
};

export default connect(mapStateToProps, null)(CheckoutRowData);
