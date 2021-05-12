import { Box } from "@material-ui/core";
import React from "react";
import { Config } from "../../../config/Config";

function RowData(props) {
  function displayStatus(status) {
    switch (status) {
      case Config.PRD_STATUS.A: {
        return "Đã duyệt";
      }
      case Config.PRD_STATUS.D: {
        return "Đã xóa";
      }
      case Config.PRD_STATUS.S: {
        return "Đã bán hết";
      }
      case Config.PRD_STATUS.W: {
        return "Chờ xét duyệt";
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
              src={props.product.images[0].link}
              alt=""
            />
          </Box>
          <Box flexGrow="1">
            <Box p={1}>
              <b>{props.product.title}</b>
              <Box className="color-aaa cursor-pointer">
                {props.product.seller.name}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" width="30%" alignItems="center">
          {props.product.location.detail},
          {"đường " +
            props.product.location.street +
            " , quận " +
            props.product.location.district +
            " ," +
            " thành phố Hà Nội"}
        </Box>
        <Box display="flex" width="10%" alignItems="center">
          {new Date(props.product.createdAt).toLocaleDateString()}
        </Box>
        <Box display="flex" width="15%" alignItems="center">
          {displayStatus(props.product.status)}
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
