import React, { Component } from "react";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Input,
  Modal,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

class ModalChangePassword extends Component {
  state = {};
  render() {
    return (
      <Modal
        open={this.props.show}
        onClose={this.props.onHide}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box width="50%" style={{ backgroundColor: "white" }} p={3}>
            <Box display="flex">
              <Box flexGrow={1}>
                <big>
                  <b id="modal-title">{this.props.title}</b>
                </big>
              </Box>
              <Box>
                <IconButton onClick={this.props.onHide}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Box id="modal-description">
              <Box py={1}>
                <FormControl fullWidth={true}>
                  <InputLabel>Mật khẩu cũ:</InputLabel>
                  <Input
                    required={true}
                    type="password"
                    name="oldPassword"
                    value={this.props.oldPassword}
                    onChange={this.props.onChangeOldPassword}
                  />
                </FormControl>
              </Box>
              <Box py={1}>
                <FormControl fullWidth={true}>
                  <InputLabel>Mật khẩu mới:</InputLabel>
                  <Input
                    required={true}
                    type="password"
                    name="newPassword"
                    value={this.props.newPassword}
                    onChange={this.props.onChangeNewPassword}
                  />
                </FormControl>
                <ul className="list-style-type-none">
                  <li className="padding-block-start-zero color-aaa">
                    <i>* Có ít nhất 8 ký tự</i>
                  </li>
                  <li className="padding-block-start-zero color-aaa">
                    <i>* Có chứa chữ số và chữ cái</i>
                  </li>
                  {/* <li className="padding-block-start-zero color-aaa"></li> */}
                </ul>
              </Box>
              <Box mb={2} py={1}>
                <FormControl fullWidth={true}>
                  <InputLabel>Xác nhận mật khẩu mới:</InputLabel>
                  <Input
                    required={true}
                    type="password"
                    name="confirmPassword"
                    value={this.props.confirmPassword}
                    onChange={this.props.onChangeConfirmPassword}
                  />
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.props.check}
                >
                  Đồng ý
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
}

export default ModalChangePassword;
