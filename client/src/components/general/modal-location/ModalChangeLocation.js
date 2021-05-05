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
import cNd from "../../../others/convincesAndDistricts.json";
import { Close } from "@material-ui/icons";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

class ModalChangeLocation extends Component {
  state = {
    location: this.props.location,
  };
  onChangeInput = (e) => {
    this.setState({
      location: {
        ...this.state.location,
        [e.target.name]: e.target.value,
      },
    });
  };
  getLocation = () => {
    this.props.getLocation(this.state.location);
  };
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
              <Box>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Box px={3} py={1}>
                  Hà Nội
                </Box>
              </Box>
              <Box py={1}>
                <FormControl fullWidth={true}>
                  <InputLabel>Quận/Huyện:</InputLabel>
                  <Select
                    name="districtIndex"
                    value={this.state.location.districtIndex}
                    onChange={this.onChangeInput}
                  >
                    {convincesAndDistricts[1].districts.map(
                      (district, index) => {
                        return (
                          <MenuItem value={index} key={index}>
                            <Box px={3}>{district.name}</Box>
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box py={1}>
                <FormControl fullWidth={true}>
                  <InputLabel>Đường/Phố</InputLabel>
                  <Select
                    name="streetIndex"
                    value={this.state.location.streetIndex}
                    onChange={this.onChangeInput}
                  >
                    {convincesAndDistricts[1].districts[
                      this.state.location.districtIndex
                    ].streets.map((street, index) => {
                      return (
                        <MenuItem value={index} key={index}>
                          <Box px={3}>{street.name}</Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box mb={2}>
                <FormControl fullWidth={true}>
                  <InputLabel>Chi tiết địa chỉ:</InputLabel>
                  <Input
                    required={true}
                    type="text"
                    name="detail"
                    value={this.state.location.detail}
                    onChange={this.onChangeInput}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                onClick={this.getLocation}
              >
                Đồng ý
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
}

export default ModalChangeLocation;
