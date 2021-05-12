import { Box } from "@material-ui/core";
import React from "react";

const strings = {
  nameTitle: "Gian hàng",
  addressTitle: "Địa chỉ tổ chức",
  timeTitle: "Thời gian",
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
        width="30%"
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
        width="30%"
      >
        {strings.addressTitle}
      </Box>
      <Box
        display="flex"
        py={2}
        alignItems="center"
        pl={1}
        justifyContent="center"
        borderRight="1px solid #e8e8e8"
        width="10%"
      >
        {strings.timeTitle}
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
