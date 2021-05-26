import { Box, Button, Checkbox, Select } from "@material-ui/core";
import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";

class CheckoutTotalBar extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" my={2} py={3} className="white-background">
        <Box flexGrow={1} display="flex" flexDirection="column" pl={2}>
          Lựa chọn THANH TOÁN để hoàn tất đơn hàng
          <Box display="flex" alignItems="center" px={2}>
            <Box flexGrow={1} display="flex" alignItems="center">
              Hình thức thanh toán:
            </Box>
            <Box p={1}>
              <Select
                value={this.props.paymentMethod}
                onChange={this.props.onChangePaymentMethod}
              >
                <option
                  value="Thanh toán khi nhận hàng"
                  className="cursor-pointer"
                  style={{ padding: "5px" }}
                >
                  Thanh toán khi nhận hàng
                </option>
                <option
                  value="PayPal"
                  className="cursor-pointer"
                  style={{ padding: "5px" }}
                >
                  PayPal
                </option>
                <option
                  value="Thẻ tín dụng"
                  disabled
                  className="cursor-pointer"
                  style={{ padding: "5px" }}
                >
                  Thẻ tín dụng
                </option>
              </Select>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box display="flex" alignItems="center">
            Tông giá trị đơn hàng:{" "}
            <Box ml={2}>
              <big>{turnNumberToNumberWithSeperator(this.props.total)} VND</big>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" m={2}>
            <Button
              className="backgroundcolor-orange color-white"
              variant="contained"
              onClick={this.props.placeOrder}
              disabled={this.props.total === 0}
            >
              Thanh toán
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default CheckoutTotalBar;
