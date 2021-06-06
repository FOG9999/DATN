import { Box, Button, IconButton, TextField } from "@material-ui/core";
import { Check, Close, Create, Replay } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  changePassword,
  getUserInfo,
  updateUserInfo,
} from "../../../../apis/user-pool/UserPool";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import Loading from "../../../general/Loading";
import ModalChangeLocation from "../../../general/modal-location/ModalChangeLocation";
import UpdateField from "./UpdateField";
import cNd from "../../../../others/convincesAndDistricts.json";
import ModalChangePassword from "./ModalChangePassword";
import { Config } from "../../../../config/Config";

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
    initCheck: [
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
    changed: false,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showModalChangePassword: false,
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
      changed: true,
      checkFields: [...this.state.initCheck],
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
  updateUserInfo = () => {
    this.props.dispatchLoading();
    let msg = "";
    for (let i = 0; i < this.state.checkFields.length; i++) {
      msg = this.check(this.state.checkFields[i].name);
      if (msg) break;
    }
    if (msg) {
      toast.error(msg);
      this.props.dispatchLoaded();
      return;
    }
    // chuyển index về tên quận, xã
    let district =
      convincesAndDistricts[1].districts[this.state.location.districtIndex]
        .name;
    let street =
      convincesAndDistricts[1].districts[this.state.location.districtIndex]
        .streets[this.state.location.streetIndex].name;
    let detail = this.state.location.detail;
    let newInfo = {
      ...this.state.alternative,
      address: {
        district: district,
        street: street,
        detail: detail,
      },
    };
    updateUserInfo(newInfo).then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        this.props.dispatchLoaded();
      } else {
        this.getUser();
      }
    });
  };
  onOpenModalChangePassword = () => {
    this.setState({
      showModalChangePassword: true,
    });
  };
  onCloseModalChangePassword = () => {
    this.setState({
      showModalChangePassword: false,
    });
  };
  onChangeOldPassword = (e) => {
    this.setState({
      oldPassword: e.target.value,
    });
  };
  onChangeNewPassword = (e) => {
    this.setState({
      newPassword: e.target.value,
    });
  };
  onChangeConfirmPassword = (e) => {
    this.setState({
      confirmPassword: e.target.value,
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
    if (field === "address")
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
  checkPassword = () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    if (newPassword.length < 8) {
      toast.error("Mật khẩu mới cần có ít nhất 8 ký tự");
    } else if (
      /\s/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[a-z]/i.test(newPassword)
    ) {
      toast.error("Mật khẩu mới không hợp lệ");
    } else if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không trùng khớp");
    } else {
      this.changePassword();
    }
  };
  changePassword = () => {
    this.props.dispatchLoading();
    const code = Math.round(Math.random() * 899999) + 100000;
    let message = "Mã đổi mật khẩu của bạn là " + code;
    const path = "/change-password/" + Config.ROLE.CLIENT;
    this.props.dispatchAuthen(path, "POST", (authRS) => {
      if (authRS.EC !== 0) {
        toast.error(authRS.EM);
        this.props.dispatchLoaded();
      } else {
        changePassword(
          "01672345678",
          this.state.oldPassword,
          this.state.newPassword,
          message
        ).then((rs) => {
          if (rs.EC !== 0) {
            toast.error(rs.EM);
            this.props.dispatchLoaded();
          } else {
            toast.success("Đổi mật khẩu thành công. Hãy đăng nhập lại!");
            this.props.dispatchLogout(() => {
              window.location.href = "/";
            });
          }
        });
      }
    });
  };
  componentDidMount() {
    this.getUser();
  }
  check = (name) => {
    let msg = "";
    let { checkFields, alternative } = this.state;
    switch (name) {
      case "name": {
        if (!alternative[name]) {
          msg = "Trường tên không được để trống";
          checkFields.filter((field) => {
            if (field.name === name) {
              field.error = true;
            }
          });
        }
        break;
      }
      case "phone": {
        if (alternative[name].length !== 10) {
          msg = "Số điện thoại không hợp lệ";
          checkFields.filter((field) => {
            if (field.name === name) {
              field.error = true;
            }
          });
        }
        break;
      }
      default:
        break;
    }
    this.setState({
      checkFields: [...checkFields],
    });
    return msg;
  };
  render() {
    if (this.props.loading) {
      return (
        <Box>
          {/* <ToastContainer /> */}
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
        {/* <ToastContainer /> */}
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
                    name="name"
                    onChange={(e) => this.onChange(e.target.value, "name")}
                  />
                ) : (
                  <big
                    className={
                      this.state.checkFields[0].error ? "color-red" : ""
                    }
                  >
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
              <IconButton onClick={() => this.reloadValue("address")}>
                <Replay size="small" />
              </IconButton>
            </Box>
          </Box>
          <ModalChangePassword
            check={this.checkPassword}
            show={this.state.showModalChangePassword}
            onHide={this.onCloseModalChangePassword}
            title="Đổi mật khẩu"
            oldPassword={this.state.oldPassword}
            newPassword={this.state.newPassword}
            onChangeNewPassword={this.onChangeNewPassword}
            onChangeConfirmPassword={this.onChangeConfirmPassword}
            confirmPassword={this.state.confirmPassword}
            onChangeOldPassword={this.onChangeOldPassword}
          />
          <ModalChangeLocation
            title="Thay đổi địa chỉ "
            location={this.state.location}
            show={this.state.showModalLocation}
            onHide={this.onHideModalLocation}
            getLocation={this.getLocation}
          />
          <Box display="flex" flexDirection="row-reverse" py={2}>
            <Box mx={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.onOpenModalChangePassword}
              >
                Thay đổi mật khẩu
              </Button>
            </Box>
            <Box mx={1}>
              <Button
                disabled={!this.state.changed}
                variant="contained"
                color="primary"
                onClick={this.updateUserInfo}
              >
                Cập nhật thông tin
              </Button>
            </Box>
          </Box>
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
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SellerInfo);
