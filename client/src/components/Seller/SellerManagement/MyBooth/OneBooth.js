import { Box, Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";

class OneBooth extends Component {
  state = {};
  displayStatus = (status) => {
    switch (status) {
      case "WAITING": {
        return "Chờ xét duyệt";
      }
      case "DENY": {
        return "Từ chối";
      }
      case "ACCEPT": {
        return "Đang hoạt động";
      }
      default:
        return status;
    }
  };
  render() {
    return (
      <Box
        p={2}
        border="1px solid grey"
        borderRadius="5px"
        m={1}
        maxWidth="30%"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <img src={this.props.booth.images[0].link} height="200px" alt="" />
        </Box>
        <Box>
          <Box py={1}>
            <b>{this.props.booth.name}</b>
          </Box>
          <Box>
            <p>Tổ chức: {this.props.booth.organization_name}</p>
            <p className="color-aaa">
              Trạng thái: {this.displayStatus(this.props.booth.status)}
            </p>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={1}
          >
            <Button
              variant="contained"
              className="backgroundcolor-orange color-white"
              onClick={this.props.onOpenModal}
            >
              Xem thêm
            </Button>
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
    dispatchLoading: () => {
      dispatch(GeneralAction.loading());
    },
    dispatchLoaded: () => {
      dispatch(GeneralAction.loaded());
    },
    dispatchAuthen: (path, method, done) => {
      dispatch(UserAction.authen(path, method, done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OneBooth);
