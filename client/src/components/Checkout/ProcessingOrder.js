import { Box } from "@material-ui/core";
import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { captureOrder } from "../../apis/order-pool/OrderPool";
import Loading from "../general/Loading";

class ProcessingOrder extends Component {
  constructor(props) {
    super(props);
    document.title = "Đang chờ xử lý đơn hàng";
  }
  state = {};
  componentDidMount() {
    let temp_ord = JSON.parse(localStorage.getItem("temp_ord"));
    captureOrder(
      temp_ord.orderID,
      temp_ord.products,
      temp_ord.total,
      temp_ord.shipFeeArr,
      temp_ord.paymentMethod
    ).then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        setTimeout(() => (window.location.href = "/m/cart"), 5000);
      } else {
        localStorage.removeItem("temp_ord");
        toast.success("Đặt hàng thành công !");
        setTimeout(() => (window.location.href = "/m/order-history"), 2000);
      }
    });
  }
  render() {
    return (
      <Box>
        <ToastContainer />
        <Loading />
      </Box>
    );
  }
}

export default ProcessingOrder;
