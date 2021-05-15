import { Box, Button, Checkbox } from "@material-ui/core";
import React, { Component } from "react";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";

class TotalBar extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" my={2} py={3} className="white-background">
        <Box flexGrow={1} display="flex">
          <Checkbox
            onChange={this.props.onChange}
            checked={this.props.checkAll}
          />
          <Box display="flex">Chọn tất cả</Box>
        </Box>
        <Box display="flex">
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
              Mua hàng
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default TotalBar;
