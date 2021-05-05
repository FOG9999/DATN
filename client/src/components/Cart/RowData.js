import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";
import { connect } from "react-redux";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import Loading from "../../components/general/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import {
  Add,
  ArrowForwardIos,
  LocalShipping,
  // PlusOneOutlined,
  Remove,
} from "@material-ui/icons";

const strings = {
  overLimit: "Vượt quá số lượng hàng đang có",
  onlyNumber: "Chỉ được nhập số",
};

class RowData extends Component {
  state = {
    orderQuantity: this.props.orderProduct.order_quantity,
  };
  onClickLink = () => {
    window.location.href = "/prd/" + this.props.orderProduct.product._id;
  };
  onChangeInputField = (e) => {
    if (e.target.name === "orderQuantity" && /\D/.test(e.target.value)) {
      toast.error(strings.onlyNumber);
    } else if (
      parseInt(e.target.value) > this.props.orderProduct.product.quantity
    ) {
      toast.error(strings.overLimit);
    } else {
      this.props.onChangeQuantity(this.props.index, e.target.value);
      this.setState({
        orderQuantity: e.target.value,
      });
    }
  };
  onAddOneOrderQuantity = () => {
    if (this.state.orderQuantity < this.props.orderProduct.product.quantity) {
      this.setState({
        orderQuantity: ++this.state.orderQuantity,
      });
      // gọi hàm thay đổi total của cha
      this.props.onAddQuantity(this.props.index);
    } else {
      toast.error(strings.overLimit);
    }
  };
  onMinusOneOrderQuantity = () => {
    this.setState({
      orderQuantity: --this.state.orderQuantity,
    });
    this.props.onMinusQuantity(this.props.index);
    // gọi hàm thay đổi total của cha
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
              <Checkbox
                name={`prd${this.props.orderProduct.product._id}`}
                checked={this.props.checked}
                onChange={(e) =>
                  this.props.onCheck(
                    e,
                    this.props.index,
                    this.state.orderQuantity
                  )
                }
              />
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
                    {this.props.orderProduct.product.title}
                  </span>
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
            <Box width="15%" alignItems="center">
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={this.onMinusOneOrderQuantity}
                  disabled={this.state.orderQuantity === 1}
                >
                  <Remove />
                </IconButton>
                <input
                  type="text"
                  value={this.state.orderQuantity}
                  onChange={this.onChangeInputField}
                  name="orderQuantity"
                  className="text-center input-order-quantity"
                />
                <IconButton>
                  <Add onClick={this.onAddOneOrderQuantity} />
                </IconButton>
              </Box>
              <Box display="flex" justifyContent="center">
                Hiện có: {this.props.orderProduct.product.quantity}
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
              width="8%"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                color="secondary"
                onClick={() =>
                  this.props.removeProduct(this.props.orderProduct._id)
                }
              >
                Xóa
              </Button>
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

export default connect(mapStateToProps, null)(RowData);
