import { Box, Button } from "@material-ui/core";
import React, { Component } from "react";
import { Functions } from "../../others/functions/functions";
import CheckoutRowData from "../Checkout/CheckoutRowData";

class OrderHistoryRowData extends Component {
  state = {};
  render() {
    return (
      <Box>
        <CheckoutRowData
          orderProduct={this.props.orderProduct}
          index={this.props.index}
          shipFee={this.props.shipFee}
        />
        <Box>
          <Box display="flex" p={1}>
            <Box flexGrow="1" pl={2}>
              Trạng thái đơn hàng:
            </Box>
            <Box>{Functions.displayOrderStatus(this.props.order.status)}</Box>
          </Box>
          <Box display="flex" p={1}>
            <Box flexGrow="1" pl={2}>
              Ngày đặt hàng:
            </Box>
            <Box>
              {new Date(this.props.order.createdAt).toLocaleDateString()}
            </Box>
          </Box>
          {this.props.order.status === "0" ? (
            <Box p={1} display="flex" flexDirection="row-reverse">
              <Box>
                <Button variant="contained">Hủy đơn</Button>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

export default OrderHistoryRowData;
