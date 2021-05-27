import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { ShoppingCart, Videocam } from "@material-ui/icons";
import { connect } from "react-redux";
import { UserAction } from "../../../redux/actions/UserAction";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreateStream from "./ModalCreateStream";
import { createLivestream } from "../../../apis/other-pool/OtherPool";

class HeaderButtons extends Component {
  state = {
    openModal: false,
  };
  onLogout = () => {
    this.props.dispatchLogout((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
      } else {
        window.location.href = "/";
      }
    });
  };
  createLivestream = (title, name, id) => {
    this.props.dispatchLoading();
    createLivestream(id, name, title).then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
      } else {
        window.location.href = "/livestream/" + rs.data.id;
      }
      this.props.dispatchLoaded();
    });
  };
  onCloseModal = () => {
    this.setState({
      openModal: false,
    });
  };
  onOpenModal = () => {
    if (this.props.logged)
      this.setState({
        openModal: true,
      });
    else toast.error("Bạn chưa đăng nhập -_-");
  };
  render() {
    return (
      <Box display="flex" flexDirection="row">
        <ToastContainer />
        <Box display="flex" flexGrow={1} justifyContent="flex-start">
          <Box py={1} px={2} className="color-white" onClick={this.onOpenModal}>
            Livestream
          </Box>
          <Box py={1} px={2} className="color-white">
            Giá rẻ
          </Box>
          <Box py={1} px={2} className="color-white">
            <a
              href="http://localhost:3000#near-me"
              className="link-no-text-decoration-2"
            >
              Gần tôi
            </a>
          </Box>
          <Box py={1} px={2} className="color-white">
            <a href="/order-history" className="link-no-text-decoration-2">
              Lịch sử
            </a>
          </Box>
        </Box>
        <ModalCreateStream
          open={this.state.openModal}
          onClose={this.onCloseModal}
          createLivestream={this.createLivestream}
          name={this.props.name}
        />
        <Box display="flex" justifyContent="flex-end">
          <Box p={1} className="color-white">
            Thông báo
          </Box>
          {this.props.logged ? (
            <Box p={1} className="color-white">
              <a
                href="/m/manage/order"
                style={{ textDecoration: "none", color: "white" }}
              >
                Tôi
              </a>
            </Box>
          ) : null}
          {this.props.logged ? (
            <Box p={1} display="flex" className="color-white">
              Chào {this.props.name}.{" "}
              <Box
                px={1}
                display="flex"
                alignItems="flex-start"
                className="color-white"
              >
                <ShoppingCart
                  color="white"
                  onClick={() => {
                    window.location.href = "/m/cart";
                  }}
                />
                ({this.props.cartNum})
              </Box>
              <span className="fake-link" onClick={this.onLogout}>
                Đăng xuất?
              </span>
            </Box>
          ) : (
            <Box p={1} className="color-white">
              Bạn chưa đăng nhập. <a href="/login">Đăng nhập</a>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
    name: state.user.name,
    cartNum: state.user.cartNum,
    loading: state.general.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
    dispatchLoading: () => {
      dispatch(GeneralAction.loading());
    },
    dispatchLoaded: () => {
      dispatch(GeneralAction.loaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderButtons);
