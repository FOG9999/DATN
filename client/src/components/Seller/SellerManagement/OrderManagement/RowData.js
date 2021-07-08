import { Box, Button } from "@material-ui/core";
import { Message } from "@material-ui/icons";
import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../../../others/functions/checkTextForNumberInput";
import cNd from "../../../../others/convincesAndDistricts.json";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

class RowData extends Component {
  state = {};
  displayOrderStatus = (key) => {
    switch (key) {
      case "0":
        return "Chờ xác nhận";
      case "3":
        return "Trả hàng";
      case "2":
        return "Đã nhận hàng";
      case "1":
        return "Đang giao hàng";
      case "-1":
        return "Đã hủy đơn";
      default:
        break;
    }
  };
  displayDeliveryType = (type) => {
    switch (type) {
      case "deliver":
        return "Giao hàng tại nhà";
      case "self":
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

        <Box display="flex" borderBottom="1px solid #e8e8e8">
          <Box display="flex" width="35%" alignItems="center">
            <Box display="flex" justifyContent="center" width="25%">
              <img
                style={{ width: "50px", height: "50px" }}
                src={this.props.order.product.product.images[0].link}
                alt=""
              />
            </Box>
            <Box flexGrow="1">
              <Box p={1}>
                <b>{this.props.order.product.product.title}</b>
              </Box>
              <Box p={1}>
                <small>
                  Số lượng: {this.props.order.product.order_quantity}
                </small>
              </Box>
            </Box>
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {turnNumberToNumberWithSeperator(
              this.props.order.product.product.price
            )}
            &nbsp;VND
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {new Date(this.props.order.createdAt).toLocaleDateString()}
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {this.displayDeliveryType(this.props.order.delivery_type)}
          </Box>
          <Box display="flex" width="25%" alignItems="center">
            <p px={1}>
              {this.props.order.product.delivery_location.detail},<br />
              {"đường " +
                convincesAndDistricts[1].districts[
                  this.props.order.product.delivery_location.districtIndex
                ].streets[
                  this.props.order.product.delivery_location.streetIndex
                ].name +
                " , quận " +
                convincesAndDistricts[1].districts[
                  this.props.order.product.delivery_location.districtIndex
                ].name +
                " ," +
                " thành phố Hà Nội"}
            </p>
          </Box>
        </Box>
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
          {this.props.order.status === "0" &&
          this.props.order.delivery_type === "deliver" ? (
            <Box p={1} display="flex" flexDirection="row-reverse">
              <Box>
                <Button
                  variant="contained"
                  onClick={() =>
                    this.props.startDeliver([this.props.order._id])
                  }
                >
                  Giao hàng
                </Button>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

export default RowData;
