import { Box } from "@material-ui/core";
import React from "react";

function RowData(props) {
  function displayStatus(status) {
    switch (status) {
      case "WAITING": {
        return "Chờ xét duyệt";
      }
      case "DENY": {
        return "Từ chối";
      }
      case "ACCEPT": {
        return "Đang hoạt động";
      }
      default:
        return status;
    }
  }
  return (
    <Box border="1px solid #e8e8e8" mt={2}>
      <Box display="flex" borderBottom="1px solid #e8e8e8">
        <Box display="flex" width="30%" alignItems="center" py={1}>
          <Box display="flex" justifyContent="center" width="25%">
            <img
              style={{ width: "50px", height: "50px" }}
              src={props.booth.images[0].link}
              alt=""
            />
          </Box>
          <Box flexGrow="1">
            <Box p={1}>
              <b>{props.booth.name}</b>
              <Box className="color-aaa cursor-pointer">
                {props.booth.owner.name}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" width="30%" alignItems="center">
          {props.booth.location.detail},
          {"đường " +
            props.booth.location.street +
            " , quận " +
            props.booth.location.district +
            " ," +
            " thành phố Hà Nội"}
        </Box>
        <Box display="flex" width="10%" alignItems="center">
          {new Date(props.booth.start_from).toLocaleDateString()}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {displayStatus(props.booth.status)}
        </Box>
        <Box
          display="flex"
          width="15%"
          alignItems="center"
          onClick={() => props.onOpenModal(props.index)}
        >
          <span className="cursor-pointer color-blue">Xem thêm</span>
        </Box>
      </Box>
    </Box>
  );
}

export default RowData;
