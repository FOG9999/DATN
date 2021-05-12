import { Box } from "@material-ui/core";
import React from "react";

const strings = {
  nameTitle: "Tên kiểm duyệt viên",
  phoneTitle: "Số điện thoại",
  usernameTitle: "Tên đăng nhập",
  passwordTitle: "Mật khẩu",
  statusTitle: "Trạng thái",
  optionTitle: "Tùy chọn",
};

function RowHeader() {
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
        {strings.nameTitle}
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
        {strings.phoneTitle}
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
        {strings.usernameTitle}
      </Box>
      <Box
        display="flex"
        py={2}
        alignItems="center"
        pl={1}
        borderRight="1px solid #e8e8e8"
        width="15%"
      >
        {strings.passwordTitle}
      </Box>
      <Box
        display="flex"
        py={2}
        alignItems="center"
        pl={1}
        borderRight="1px solid #e8e8e8"
        width="15%"
      >
        {strings.statusTitle}
      </Box>
      <Box
        display="flex"
        py={2}
        alignItems="center"
        pl={1}
        borderRight="1px solid #e8e8e8"
        width="15%"
      >
        {strings.optionTitle}
      </Box>
    </Box>
  );
}

export default RowHeader;
