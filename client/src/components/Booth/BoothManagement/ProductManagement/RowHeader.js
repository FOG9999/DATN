import { Box } from "@material-ui/core";
import React, { Component } from "react";

const strings = {
  productTitle: "Sản phẩm",
  productTypeTitle: "Loại sản phẩm",
  onDateTitle: "Đăng bán vào",
  inStockTitle: "Trong kho",
  soldTitle: "Đã bán",
  showMoreTitle: "Tùy chọn",
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
          width="25%"
        >
          {strings.productTitle}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          justifyContent="center"
          width="15%"
        >
          {strings.productTypeTitle}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          justifyContent="center"
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
          {strings.inStockTitle}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="15%"
        >
          {strings.soldTitle}
        </Box>
        <Box
          display="flex"
          py={2}
          alignItems="center"
          pl={1}
          borderRight="1px solid #e8e8e8"
          width="15%"
        >
          {strings.showMoreTitle}
        </Box>
      </Box>
    );
  }
}

export default RowHeader;
