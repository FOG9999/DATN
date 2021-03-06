import React, { Component } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Input,
  InputAdornment,
  InputLabel,
  FormControl,
  Divider,
} from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AccountCircle, Lock } from "@material-ui/icons";
import logo from "../../images/Hanoi_Buffaloes_logo.png";
import cNd from "../../others/convincesAndDistricts.json";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

class RegisterBox extends Component {
  state = {
    conviceIndex: 0,
    distrcictIndex: 0,
    streetIndex: 0,
    openStreet: false,
    openDistrict: false,
    openConvince: false,
    addressConvinceIndex: 1,
    addressDistrictIndex: 0,
    addressStreetIndex: 0,
    openAddessStreet: false,
    openAddressDistrict: false,
    openAddressConvince: false,
    winWidth: window.innerWidth,
    birthday: new Date(),
  };
  updateDimension = () => {
    this.setState({
      winWidth: window.innerWidth,
    });
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimension);
  }
  onChangeNumberInputField = (e) => {
    this.setState({
      [e.target.name]: parseInt(e.target.value),
    });
  };
  toggleSelectStreet = () => {
    this.setState({
      openStreet: !this.state.openStreet,
    });
  };
  toggleSelectDistrict = () => {
    this.setState({
      openDistrict: !this.state.openDistrict,
    });
  };
  toggleSelectConvince = () => {
    this.setState({
      openConvince: !this.state.openConvince,
    });
  };
  toggleSelectAddressStreet = () => {
    this.setState({
      openAddressStreet: !this.state.openAddressStreet,
    });
  };
  toggleSelectAddressDistrict = () => {
    this.setState({
      openAddressDistrict: !this.state.openAddressDistrict,
    });
  };
  toggleSelectAddressConvince = () => {
    this.setState({
      openAddressConvince: !this.state.openAddressConvince,
    });
  };
  onChangeBirthDay = (date) => {
    this.setState({
      birthday: date,
    });
  };
  render() {
    return (
      <Box
        display="flex"
        justifyContent="center"
        px={2}
        py={3}
        className="login-loginbox-box0"
        flexDirection="column"
      >
        <Box textAlign="center">
          <Box>
            <img src={logo} className="login-loginbox-logo" alt="" />
          </Box>
          <h1>Ch??? sinh vi??n H?? N???i</h1>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel htmlFor="input-with-icon-adornment">
              T??n ????ng nh???p
            </InputLabel>
            <Input
              required="true"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel htmlFor="input-with-icon-adornment">
              M???t kh???u
            </InputLabel>
            <Input
              required="true"
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel htmlFor="input-with-icon-adornment">
              X??c nh???n l???i m???t kh???u
            </InputLabel>
            <Input
              required="true"
              type="password"
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <Box
          p={3}
          display="flex"
          flexDirection={this.state.winWidth <= 650 ? "column" : "row"}
        >
          <Box py={2} pr={2}>
            <b>Qu?? qu??n</b>
          </Box>
          <Box p={2}>
            <FormControl>
              <InputLabel htmlFor="input-with-icon-adornment">???????ng</InputLabel>
              <Select
                open={this.state.openStreet}
                name="streetIndex"
                value={this.state.streetIndex}
                onChange={this.onChangeNumberInputField}
                onOpen={this.toggleSelectStreet}
                onClose={this.toggleSelectStreet}
              >
                {convincesAndDistricts[this.state.conviceIndex].districts[
                  this.state.distrcictIndex
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
          <Box p={2}>
            <FormControl>
              <InputLabel htmlFor="input-with-icon-adornment">
                Qu???n/Huy???n
              </InputLabel>
              <Select
                open={this.state.openDistrict}
                name="distrcictIndex"
                value={this.state.distrcictIndex}
                onChange={this.onChangeNumberInputField}
                onOpen={this.toggleSelectDistrict}
                onClose={this.toggleSelectDistrict}
              >
                {convincesAndDistricts[this.state.conviceIndex].districts.map(
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
          <Box p={2} width="150px">
            <FormControl>
              <InputLabel htmlFor="input-with-icon-adornment">
                T???nh/Th??nh ph???
              </InputLabel>
              <Select
                open={this.state.openConvince}
                name="conviceIndex"
                value={this.state.conviceIndex}
                onChange={this.onChangeNumberInputField}
                onOpen={this.toggleSelectConvince}
                onClose={this.toggleSelectConvince}
              >
                {convincesAndDistricts.map((convince, index) => {
                  return (
                    <MenuItem value={index} key={index}>
                      <Box px={3}>{convince.name}</Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          p={3}
          display="flex"
          flexDirection={this.state.winWidth <= 650 ? "column" : "row"}
        >
          <Box py={2} pr={2}>
            <b>Ch??? ??? hi???n t???i</b>
          </Box>
          <Box p={2}>
            <FormControl>
              <InputLabel htmlFor="input-with-icon-adornment">???????ng</InputLabel>
              <Select
                open={this.state.openAddressStreet}
                name="addressStreetIndex"
                value={this.state.addressStreetIndex}
                onChange={this.onChangeNumberInputField}
                onOpen={this.toggleSelectAddressStreet}
                onClose={this.toggleSelectAddressStreet}
              >
                {convincesAndDistricts[
                  this.state.addressConvinceIndex
                ].districts[this.state.addressDistrictIndex].streets.map(
                  (street, index) => {
                    return (
                      <MenuItem value={index} key={index}>
                        <Box px={3}>{street.name}</Box>
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            </FormControl>
          </Box>
          <Box p={2}>
            <FormControl>
              <InputLabel htmlFor="input-with-icon-adornment">
                Qu???n/Huy???n
              </InputLabel>
              <Select
                open={this.state.openAddressDistrict}
                name="addressDistrictIndex"
                value={this.state.addressDistrictIndex}
                onChange={this.onChangeNumberInputField}
                onOpen={this.toggleSelectAddressDistrict}
                onClose={this.toggleSelectAddressDistrict}
              >
                {convincesAndDistricts[
                  this.state.addressConvinceIndex
                ].districts.map((district, index) => {
                  return (
                    <MenuItem value={index} key={index}>
                      <Box px={3}>{district.name}</Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box p={2} width="150px">
            <InputLabel>T???nh/Th??nh ph???</InputLabel>
            <Box px={3}>H?? N???i</Box>
          </Box>
        </Box>
        <Box>
          <Box display="flex" px={3}>
            <Box mr={2}>
              <b>Ng??y sinh</b>
            </Box>
            <DatePicker
              selected={this.state.birthday}
              onChange={this.onChangeBirthDay}
            />
          </Box>
        </Box>
        <Box p={3}>
          <FormControl fullWidth="true">
            <InputLabel>S??? th??ch</InputLabel>
            <Input required="true" type="text" />
          </FormControl>
        </Box>
        <Box p={3}>
          <Button
            fullWidth={true}
            className="login-loginbox-buttonlogin"
            mb={1}
            color="primary"
            variant="contained"
          >
            <b>Register</b>
          </Button>
          <Box textAlign="center" pt={2}>
            <a href="/">????? sau</a>
          </Box>
        </Box>
        <Divider />
        <Box textAlign="center" p={2}>
          <span className="color-aaa">???? c?? t??i kho???n?</span>
          <span className="fake-link" onClick={this.props.switchLogin}>
            ????ng nh???p ngay
          </span>
        </Box>
      </Box>
    );
  }
}

export default RegisterBox;
