import { Box } from "@material-ui/core";
import React, { Component } from "react";

const strings = {
  productHeader: "Sản phẩm",
  priceHeader: "Giá thành",
  quantityHeader: "Số lượng",
  totalHeader: "Số tiền",
  shipFeeHeader: "Phí vận chuyển",
};

class CheckoutRowHeader extends Component {
  state = {};
  render() {
    return (
      <Box
        className="white-background"
        display="flex"
        borderBottom="2px solid #e8e8e8"
        borderTop="2px solid #e8e8e8"
        width="100%"
      >
        <Box
          display="flex"
          py={2}
          alignItems="center"
          justifyContent="center"
          pl={1}
          // borderRight="1px solid #e8e8e8"
          width="50%"
        >
          <b>{strings.productHeader}</b>
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          justifyContent="center"
          // borderRight="1px solid #e8e8e8"
          width="15%"
        >
          <b>{strings.priceHeader}</b>
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          justifyContent="center"
          pl={1}
          // borderRight="1px solid #e8e8e8"
          width="10%"
        >
          <b>{strings.quantityHeader}</b>
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          justifyContent="center"
          pl={1}
          // borderRight="1px solid #e8e8e8"
          width="15%"
        >
          <b>{strings.totalHeader}</b>
        </Box>
        <Box display="flex" py={2} alignItems="center" px={1} width="10%">
          <b>{strings.shipFeeHeader}</b>
        </Box>
      </Box>
    );
  }
}

export default CheckoutRowHeader;
