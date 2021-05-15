import { Box, Button, Checkbox } from "@material-ui/core";
import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";

class CheckoutTotalBar extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" my={2} py={3} className="white-background">
        <Box flexGrow={1} display="flex" pl={2} alignItems="center">
          Lựa chọn THANH TOÁN để hoàn tất đơn hàng
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
