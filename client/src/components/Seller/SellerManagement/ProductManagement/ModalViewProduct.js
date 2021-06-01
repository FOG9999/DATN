import { Box, Button, IconButton, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { Config } from "../../../../config/Config";
import { turnNumberToNumberWithSeperator } from "../../../../others/functions/checkTextForNumberInput";

function ModalPrdUploadShow(props) {
  function diplayStatus(status) {
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

  if (props.product)
    return (
      <Modal
        open={props.show}
        onClose={props.onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{ overflowY: "scroll" }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box width="75%" style={{ backgroundColor: "white" }} p={3}>
            <Box display="flex">
              <Box flexGrow={1} display="flex" justifyContent="center">
                <big>
                  <b id="modal-title">{props.product.title}</b>
                </big>
              </Box>
              <Box>
                <IconButton onClick={props.onClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Box id="modal-description">
              <Box display="flex">
                <Box px={3} py={1}>
                  Tên sản phẩm:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.product.title}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Số lượng:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.product.quantity}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Chủng loại:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.product.category}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Đăng ngày:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {new Date(props.product.createdAt).toLocaleDateString()}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Địa điểm sản phẩm:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.product.location.detail},
                  {"đường " +
                    props.product.location.street +
                    " , quận " +
                    props.product.location.district +
                    " ," +
                    " thành phố Hà Nội"}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Giá thành:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {turnNumberToNumberWithSeperator(props.product.price)}đ
                </Box>
              </Box>
              <Box>
                <Box px={3} py={1}>
                  Hình ảnh :
                </Box>
                <Box px={3} py={1} display="flex" flexWrap="wrap">
                  {props.product.images.map((img, ind) => {
                    return (
                      <Box key={ind} p={1}>
                        <img src={img.link} height="200px" alt="" />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box>
                <Box px={3} py={1}>
                  Mô tả sản phẩm:
                </Box>
                <Box px={3} py={1}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props.product.description,
                    }}
                  />
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Trạng thái:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {diplayStatus(props.product.status)}
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Box mx={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onClose}
                  >
                    Đóng
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  else return null;
}

export default ModalPrdUploadShow;
