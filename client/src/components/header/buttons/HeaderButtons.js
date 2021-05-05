import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { connect } from "react-redux";
import { UserAction } from "../../../redux/actions/UserAction";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class HeaderButtons extends Component {
  state = {};
  onLogout = () => {
    this.props.dispatchLogout((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
      } else {
        window.location.href = "/";
      }
    });
  };
  render() {
    return (
      <Box display="flex" flexDirection="row">
        <ToastContainer />
        <Box display="flex" flexGrow={1} justifyContent="flex-start">
          <Box py={1} px={2} className="color-white">
            Giá siêu rẻ
          </Box>
          <Box py={1} px={2} className="color-white">
            Gần tôi
          </Box>
          <Box py={1} px={2} className="color-white">
            Đăng bán
          </Box>
          <Box py={1} px={2} className="color-white">
            Lịch sử
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box p={1} className="color-white">
            Thông báo
          </Box>
          <Box p={1} className="color-white">
            <a
              href="/m/manage"
              style={{ textDecoration: "none", color: "white" }}
            >
              Tôi
            </a>
          </Box>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderButtons);
