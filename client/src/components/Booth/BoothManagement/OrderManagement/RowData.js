import { Box, Button } from "@material-ui/core";
import { Message } from "@material-ui/icons";
import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../../../others/functions/checkTextForNumberInput";
import faker from "faker";

class RowData extends Component {
  state = {};
  displayOrderStatus = (key) => {
    switch (key) {
      case "W":
        return "Chờ xác nhận";
      case "C":
        return "Trả hàng";
      case "R":
        return "Đã nhận hàng";
      case "D":
        return "Đang giao hàng";
      default:
        break;
    }
  };
  displayDeliveryType = (type) => {
    switch (type) {
      case true:
        return "Giao hàng tại nhà";
      case false:
        return "Tự đến lấy hàng";
      default:
        break;
    }
  };
  render() {
    return (
      <Box border="1px solid #e8e8e8" mt={2}>
        <Box display="flex" borderBottom="1px solid #e8e8e8">
          <Box py={1} px={2} width="30px" height="30px">
            <img
              src={this.props.order.buyer.avatar}
              width="100%"
              height="100%"
              alt=""
            />
          </Box>
          <Box display="flex" alignItems="center">
            {this.props.order.buyer.name}
          </Box>
          <Box display="flex" alignItems="center" p={1}>
            <Message className="cursor-pointer" fontSize="small" />
          </Box>
        </Box>
        {this.props.order.items.map((item, index) => {
          return (
            <Box display="flex" borderBottom="1px solid #e8e8e8" key={index}>
              <Box display="flex" width="35%" alignItems="center">
                <Box display="flex" justifyContent="center" width="25%">
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={item.image}
                    alt=""
                  />
                </Box>
                <Box flexGrow="1">
                  <Box p={1}>
                    <b>{item.title}</b>
                  </Box>
                  <Box p={1}>
                    <small>Số lượng: {item.quantity}</small>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" width="15%" alignItems="center">
                {turnNumberToNumberWithSeperator(item.price * item.quantity)}
                &nbsp;VND
              </Box>
              <Box display="flex" width="15%" alignItems="center">
                {new Date(this.props.order.on_date).toLocaleDateString()}
              </Box>
              <Box display="flex" width="15%" alignItems="center">
                {this.displayDeliveryType(this.props.order.delivery_type)}
              </Box>
              <Box display="flex" width="25%" alignItems="center">
                <p px={1}>
                  {this.props.order.location.detail_address},<br />
                  {this.props.order.location.street +
                    " ," +
                    this.props.order.location.district +
                    " ," +
                    this.props.order.location.convince}
                </p>
              </Box>
            </Box>
          );
        })}
        <Box>
          <Box display="flex" p={1}>
            <Box flexGrow="1">Trạng thái đơn hàng:</Box>
            <Box>{this.displayOrderStatus(this.props.order.status)}</Box>
          </Box>
          <Box display="flex" p={1}>
            <Box flexGrow="1">
              <b>Thành tiền:</b>
            </Box>
            <Box>
              <b>
                {turnNumberToNumberWithSeperator(this.props.order.total)} VND
              </b>
            </Box>
          </Box>
          {this.props.order.status === "W" ? (
            <Box p={1} display="flex" flexDirection="row-reverse">
              <Box>
                <Button variant="contained">Giao hàng</Button>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

export default RowData;
