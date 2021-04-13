import { Box } from "@material-ui/core";
import React, { Component } from "react";

const strings = {
  productHeader: "Sản phẩm",
  priceHeader: "Giá thành",
  onDateTitle: "Ngầy đặt hàng",
  deliveryTypeTitle: "Vận chuyển",
  locationTitle: "Địa chỉ nhận hàng",
};

class RowHeader extends Component {
  state = {};
  render() {
    return (
      <Box
        className="grey-background"
        display="flex"
        border="1px solid #e8e8e8"
        width="100%"
      >
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="35%"
        >
          {strings.productHeader}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="15%"
        >
          {strings.priceHeader}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="15%"
        >
          {strings.onDateTitle}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="15%"
        >
          {strings.deliveryTypeTitle}
        </Box>
        <Box display="flex" py={2} alignItems="center" pl={1} width="25%">
          {strings.locationTitle}
        </Box>
      </Box>
    );
  }
}

export default RowHeader;
