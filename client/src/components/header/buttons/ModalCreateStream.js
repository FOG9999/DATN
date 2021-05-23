import { Box, Button, IconButton, Modal, TextField } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";
import { Close } from "@material-ui/icons";

class ModalCreateStream extends Component {
  state = {
    streamID: "",
    streamTitle: "",
  };
  componentDidMount() {
    this.setState({
      streamID: faker.datatype.uuid(),
    });
  }
  onChangeTitle = (e) => {
    this.setState({
      streamTitle: e.target.value,
    });
  };
  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="modal-title"
        aria-description="modal-description"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box width="50%" style={{ backgroundColor: "white" }} p={3}>
            <Box display="flex">
              <Box flexGrow={1} display="flex" justifyContent="center">
                <big>
                  <b id="modal-title">Tạo livestream</b>
                </big>
              </Box>
              <Box>
                <IconButton onClick={this.props.onClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Box p={1}>
              <b>Livestream ID: {this.state.streamID}</b>
            </Box>
            <Box p={1}>
              <TextField
                onChange={this.onChangeTitle}
                value={this.state.streamTitle}
                fullWidth={true}
                placeholder="Nói gì đó về livestream của bạn"
              />
            </Box>
            <Box p={1}>
              <small style={{ color: "red" }}>* Dài không quá 50 ký tự</small>
            </Box>
            <Box display="flex" justiifyContent="flex-end" p={1}>
              <Button
                color="primary"
                variant="contained"
                disabled={
                  this.state.streamTitle.length > 50 ||
                  this.state.streamTitle.length <= 10
                }
                onClick={() =>
                  this.props.createLivestream(
                    this.state.streamTitle,
                    this.props.name,
                    this.state.streamID
                  )
                }
              >
                Bắt đầu!
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
}

export default ModalCreateStream;
