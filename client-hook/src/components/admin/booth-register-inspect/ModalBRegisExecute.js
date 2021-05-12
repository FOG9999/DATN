import { Box, Button, IconButton, Modal } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { Config } from "../../../config/Config";

function ModalShowBooth(props) {
  function diplayStatus(status) {
    switch (status) {
      case "WAITING": {
        return "Chờ xét duyệt";
      }
      case "DENY": {
        return "Bị từ chối";
      }
      case "ACCEPT": {
        return "Đã xác nhận";
      }
      default:
        return status;
    }
  }

  if (props.booth)
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
                  <b id="modal-title">{props.booth.name}</b>
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
                  Tên gian hàng:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.name}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Tên tổ chức:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.organization_name}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Tên người đứng đầu:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.leader_name}
                </Box>
                <Box px={3} py={1}>
                  Số điện thoại:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.leader_phone}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Bắt đầu từ ngày:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {new Date(props.booth.start_from).toLocaleDateString()}
                </Box>
                <Box px={3} py={1}>
                  Đến ngày:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {new Date(props.booth.end_at).toLocaleDateString()}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Địa điểm tổ chức hoặc cá nhân:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.location.detail},
                  {"đường " +
                    props.booth.location.street +
                    " , quận " +
                    props.booth.location.district +
                    " ," +
                    " thành phố Hà Nội"}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Số lượng thành viên:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {props.booth.population}
                </Box>
              </Box>
              <Box>
                <Box px={3} py={1}>
                  Hình ảnh minh chứng hoạt động:
                </Box>
                <Box px={3} py={1} display="flex" flexWrap="wrap">
                  {props.booth.images.map((img, ind) => {
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
                  Mô tả gian hàng hoặc tổ chức:
                </Box>
                <Box px={3} py={1}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: props.booth.description,
                    }}
                  />
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Tạo ngày:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {new Date(props.booth.created_at).toLocaleDateString()}
                </Box>
              </Box>
              <Box display="flex">
                <Box px={3} py={1}>
                  Trạng thái:
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center">
                  {diplayStatus(props.booth.status)}
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    props.update(
                      props.booth.status === "ACCEPT" ? "DENY" : "ACCEPT"
                    )
                  }
                >
                  {props.booth.status === "ACCEPT"
                    ? "Hủy bỏ"
                    : "Cho phép hoạt động"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  else return null;
}

export default ModalShowBooth;
