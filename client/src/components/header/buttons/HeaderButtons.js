import React, { Component } from "react";
import { Box } from "@material-ui/core";
import {} from "@material-ui/icons";

class HeaderButtons extends Component {
  state = {};
  render() {
    return (
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexGrow={1} justifyContent="flex-start">
          <Box py={1} px={2} className="color-white">
            Giá siêu rẻ
          </Box>
          <Box py={1} px={2} className="color-white">
            Gần tôi
          </Box>
          <Box py={1} px={2} className="color-white">
            Đăng bán
          </Box>
          <Box py={1} px={2} className="color-white">
            Lịch sử
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box p={1} className="color-white">
            Thông báo
          </Box>
          <Box p={1} className="color-white">
            Trợ giúp
          </Box>
          <Box p={1} className="color-white">
            Bạn chưa đăng nhập. <a href="/">Đăng nhập</a>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default HeaderButtons;
