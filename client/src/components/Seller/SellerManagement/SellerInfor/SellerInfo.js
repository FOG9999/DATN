import { Box, IconButton, TextField } from "@material-ui/core";
import { Check, Close, Create, Replay } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getUserInfo } from "../../../../apis/user-pool/UserPool";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import Loading from "../../../general/Loading";
import ModalChangeLocation from "../../../general/modal-location/ModalChangeLocation";
import UpdateField from "./UpdateField";
import cNd from "../../../../others/convincesAndDistricts.json";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

const strings = {
  errors: {
    name: {
      tooShort: "Tên quá ngắn",
      noSpecial: "Tên không bao gồm các ký tự đặc biệt",
      tooLong: "Tên quá dài",
    },
    username: {
      tooShort: "Tên đăng nhập quá ngắn",
      noSpace: "Tên đăng nhập không bao gồm dấu cách",
    },
    phone: {
      notValid: "Số điện thoại không hợp lệ",
    },
  },
};

class SellerInfo extends Component {
  state = {
    init: null,
    alternative: null,
    changing: null,
    checkFields: [
      { name: "name", error: false },
      { name: "birthday", error: false },
      // { name: "username", error: false },
      { name: "interest", error: false },
      { name: "phone", error: false },
      { name: "address", error: false },
    ],
    isUpdating: {
      name: false,
      birthday: false,
      // username: false,
      interest: false,
      phone: false,
      address: false,
    },
    location: null,
    initLocation: null,
    showModalLocation: false,
  };
  onUpdating = (field) => {
    this.setState({
      isUpdating: {
        ...this.state.isUpdating,
        [field]: true,
      },
      changing: {
        ...this.state.changing,
        [field]: this.state.alternative[field],
      },
    });
  };
  closeUpdating = (field) => {
    this.setState({
      isUpdating: {
        ...this.state.isUpdating,
        [field]: false,
      },
    });
  };
  updateValue = (field) => {
    this.setState({
      isUpdating: {
        ...this.state.isUpdating,
        [field]: false,
      },
      alternative: {
        ...this.state.alternative,
        [field]: this.state.changing[field],
      },
    });
  };
  onChange = (value, field) => {
    this.setState({
      changing: {
        ...this.state.changing,
        [field]: value,
      },
    });
  };
  getUser = () => {
    this.props.dispatchLoading();
    getUserInfo().then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        this.props.dispatchLoaded();
      } else {
        // chuyển address thành index do modal change location sử dụng index không dùng string
        let districtInd = convincesAndDistricts[1].districts
          .map((district) => district.name)
          .indexOf(rs.data.user.address.district);
        let streetInd = convincesAndDistricts[1].districts[districtInd].streets
          .map((street) => street.name)
          .indexOf(rs.data.user.address.street);
        this.setState({
          init: { ...rs.data.user },
          alternative: { ...rs.data.user },
          changing: { ...rs.data.user },
          location: {
            detail: rs.data.user.address.detail,
            streetIndex: streetInd,
            districtIndex: districtInd,
          },
          initLocation: {
            detail: rs.data.user.address.detail,
            streetIndex: streetInd,
            districtIndex: districtInd,
          },
        });
        this.props.dispatchLoaded();
      }
    });
  };
  onHideModalLocation = () => {
    this.setState({
      showModalLocation: false,
    });
  };
  getLocation = (location) => {
    this.setState({
      location: { ...location },
      showModalLocation: false,
    });
  };
  openModalLocation = () => {
    this.setState({
      showModalLocation: true,
    });
  };
  reloadValue = (field) => {
    if (field === "birthday")
      this.setState({
        location: { ...this.state.initLocation },
      });
    else {
      this.setState({
        alternative: {
          ...this.state.alternative,
          [field]: this.state.init[field],
        },
      });
    }
  };
  componentDidMount() {
    this.getUser();
  }
  render() {
    if (this.props.loading) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    }
    return (
      <Box
        m="auto"
        minWidth="800px"
        my="30px"
        className="white-background"
        borderRadius="10px"
      >
        <ToastContainer />
        <Box p={2} id="seller-info-name-avatar" display="flex">
          <Box p={1} id="seller-info-avatar">
            <img
              src={this.state.init.avatar}
              alt=""
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          </Box>
          <Box>
            <Box display="flex" p={1}>
              <Box width="400px" display="flex" alignItems="center">
                {this.state.isUpdating.name ? (
                  <TextField
                    value={this.state.changing.name}
                    fullWidth
                    size="small"
                    error={this.state.checkFields[0].error}
                  />
                ) : (
                  <big>
                    <b>{this.state.alternative.name}</b>
                  </big>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                {!this.state.isUpdating.name ? (
                  <IconButton onClick={() => this.onUpdating("name")}>
                    <Create size="small" />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => this.closeUpdating("name")}>
                    <Close size="small" />
                  </IconButton>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                {!this.state.isUpdating.name ? (
                  <IconButton onClick={() => this.reloadValue("name")}>
                    <Replay size="small" />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => this.updateValue("name")}>
                    <Check size="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box px={1}>
              <small>
                <i>
                  Đã tạo vào ngày{" "}
                  {new Date(this.state.init.created_at).toLocaleDateString()}
                </i>
              </small>
            </Box>
          </Box>
        </Box>
        <Box px={2}>
          <UpdateField
            altValue={this.state.alternative.birthday}
            error={this.state.checkFields[1].error}
            fieldName={this.state.checkFields[1].name}
            initValue={this.state.init.birthday}
            changingVal={this.state.changing.birthday}
            isUpdating={this.state.isUpdating.birthday}
            onUpdating={this.onUpdating}
            updateValue={this.updateValue}
            closeUpdating={this.closeUpdating}
            reloadValue={this.reloadValue}
            onChange={this.onChange}
            type="date"
            title="Ngày sinh"
          />
          <UpdateField
            altValue={this.state.alternative.interest}
            error={this.state.checkFields[2].error}
            fieldName={this.state.checkFields[2].name}
            initValue={this.state.init.interest}
            changingVal={this.state.changing.interest}
            isUpdating={this.state.isUpdating.interest}
            onUpdating={this.onUpdating}
            updateValue={this.updateValue}
            closeUpdating={this.closeUpdating}
            reloadValue={this.reloadValue}
            onChange={this.onChange}
            type="text"
            title="Sở thích"
          />
          <UpdateField
            altValue={this.state.alternative.phone}
            error={this.state.checkFields[3].error}
            fieldName={this.state.checkFields[3].name}
            initValue={this.state.init.phone}
            changingVal={this.state.changing.phone}
            isUpdating={this.state.isUpdating.phone}
            onUpdating={this.onUpdating}
            updateValue={this.updateValue}
            closeUpdating={this.closeUpdating}
            reloadValue={this.reloadValue}
            onChange={this.onChange}
            type="number"
            title="Số điện thoại"
          />
          <Box display="flex" p={1}>
            <Box display="flex" alignItems="center" width="200px">
              Địa chỉ
            </Box>
            <Box width="500px" display="flex" alignItems="center" px={1}>
              {`${this.state.location.detail}, đường ${
                convincesAndDistricts[1].districts[
                  this.state.location.districtIndex
                ].streets[this.state.location.streetIndex].name
              }, quận ${
                convincesAndDistricts[1].districts[
                  this.state.location.districtIndex
                ].name
              }, thành phố Hà Nội`}
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton onClick={this.openModalLocation}>
                <Create size="small" />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton>
                <Replay size="small" />
              </IconButton>
            </Box>
          </Box>
          <ModalChangeLocation
            title="Thay đổi địa chỉ "
            location={this.state.location}
            show={this.state.showModalLocation}
            onHide={this.onHideModalLocation}
            getLocation={this.getLocation}
          />
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
    loading: state.general.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAuthen: (path, method, done) => {
      dispatch(UserAction.authen(path, method, done));
    },
    dispatchLoading: () => {
      dispatch(GeneralAction.loading());
    },
    dispatchLoaded: () => {
      dispatch(GeneralAction.loaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerInfo);
