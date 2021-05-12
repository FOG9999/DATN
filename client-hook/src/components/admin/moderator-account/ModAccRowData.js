import { Box } from "@material-ui/core";
import React from "react";

function RowData(props) {
  function displayStatus(status) {
    switch (status) {
      case "A": {
        return "Hoạt động";
      }
      case "B": {
        return "Tạm khóa";
      }
      default:
        return status;
    }
  }
  return (
    <Box border="1px solid #e8e8e8" mt={2}>
      <Box display="flex" borderBottom="1px solid #e8e8e8">
        <Box display="flex" width="25%" alignItems="center" py={1}>
          <Box display="flex" justifyContent="center" width="20%">
            <img
              style={{ width: "50px", height: "50px" }}
              src={props.mod.user.avatar}
              alt=""
            />
          </Box>
          <Box flexGrow="1">
            <Box p={1}>
              <b>{props.mod.user.name}</b>
            </Box>
          </Box>
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {props.mod.user.phone}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {props.mod.user.username}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {props.mod.password}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {displayStatus(props.mod.user.status)}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          <span className="cursor-pointer color-blue">Xem thêm</span>
        </Box>
      </Box>
    </Box>
  );
}

export default RowData;
