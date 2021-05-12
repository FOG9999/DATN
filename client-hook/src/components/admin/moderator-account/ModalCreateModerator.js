import { Box, Button, IconButton, Modal, TextField } from "@material-ui/core";
import { Close, Cached } from "@material-ui/icons";
import React, { useState } from "react";
import faker from "faker";
import { useDispatch, useSelector } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { UserAction } from "../../../redux/actions/UserAction";
import { toast, ToastContainer } from "react-toastify";
import { AdminPool } from "../../../apis/AdminPool";

function ModalCreateModerator(props) {
  const [mod, setMod] = useState({
    name: "",
    phone: "",
    username: faker.lorem.word() + "." + faker.lorem.word(),
    password: faker.lorem.word() + "." + faker.lorem.word(),
  });
  const logged = useSelector((state) => state.user.logged);
  const loading = useSelector((state) => state.general.loading);
  const dispatch = useDispatch();

  function onChangeInputField(e) {
    setMod({
      ...mod,
      [e.target.name]: e.target.value,
    });
  }

  function reloadField(name) {
    setMod({
      ...mod,
      [name]: faker.lorem.word() + "." + faker.lorem.word(),
    });
  }
  function createModerator() {
    dispatch(GeneralAction.loading());
    dispatch(
      UserAction.authen("/create-account/mod/ADMIN", "POST", (auth) => {
        if (auth.EC !== 0) {
          dispatch(GeneralAction.loaded());
          toast.error(auth.EM);
        } else {
          AdminPool.createModerator(
            mod.name,
            mod.phone,
            mod.username,
            mod.password,
            (rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
                dispatch(GeneralAction.loaded());
              } else {
                toast.success(rs.EM);
                dispatch(GeneralAction.loaded());
                props.onClose();
                props.setAdded();
              }
            }
          );
        }
      })
    );
  }
  return (
    <Modal
      open={props.show}
      onClose={props.onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ overflowY: "scroll" }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <ToastContainer />
        <Box width="75%" style={{ backgroundColor: "white" }} p={3} mt={4}>
          <Box display="flex">
            <Box flexGrow={1} display="flex" justifyContent="center">
              <big>
                <b id="modal-title">Thêm kiểm duyệt viên</b>
              </big>
            </Box>
            <Box>
              <IconButton onClick={props.onClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          <Box id="modal-description">
            <Box display="flex" py={1}>
              <Box px={3} py={1} width="150px">
                Tên người dùng:
              </Box>
              <Box display="flex" width="600px" alignItems="center">
                <TextField
                  size="small"
                  value={mod.name}
                  name="name"
                  fullWidth={true}
                  onChange={onChangeInputField}
                />
              </Box>
            </Box>
            <Box display="flex" py={1}>
              <Box px={3} py={1} width="150px">
                Số điện thoại:
              </Box>
              <Box display="flex" width="600px" alignItems="center">
                <TextField
                  size="small"
                  value={mod.phone}
                  name="phone"
                  fullWidth={true}
                  onChange={onChangeInputField}
                />
              </Box>
            </Box>
            <Box display="flex" py={1}>
              <Box px={3} py={1} width="150px">
                Tên đăng nhập:
              </Box>
              <Box display="flex" width="600px" alignItems="center">
                <TextField
                  size="small"
                  value={mod.username}
                  name="phone"
                  disabled={true}
                  fullWidth={true}
                  onChange={onChangeInputField}
                />
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => reloadField("username")}>
                  <Cached />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" py={1}>
              <Box px={3} py={1} width="150px">
                Mật khẩu:
              </Box>
              <Box display="flex" width="600px" alignItems="center">
                <TextField
                  size="small"
                  value={mod.password}
                  name="password"
                  disabled={true}
                  fullWidth={true}
                  onChange={onChangeInputField}
                />
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => reloadField("password")}>
                  <Cached />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" mt={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                onClick={createModerator}
              >
                Tạo tài khoản
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalCreateModerator;
