import { Box, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { getListBoothes } from "../../../../apis/user-pool/UserPool";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import Loading from "../../../general/Loading";
import ModalShowBooth from "./ModalShowBooth";
import OneBooth from "./OneBooth";

class ListBoothes extends Component {
  state = {
    list: [],
    showBoothDetail: false,
    selectedBoothIndex: 0,
  };
  onOpenDetailModal = (index) => {
    console.log("xxx");
    this.setState({
      showBoothDetail: true,
      selectedBoothIndex: index,
    });
  };
  onCloseModal = () => {
    this.setState({
      showBoothDetail: false,
    });
  };
  componentDidMount() {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/booth/get-list/CLIENT";
      this.props.dispatchAuthen(path, "GET", (auth) => {
        if (auth.EC !== 0) {
          toast.error(auth.EM);
          this.props.dispatchLoaded();
        } else {
          this.getList();
        }
      });
    }
  }
  getList = () => {
    getListBoothes((boothRS) => {
      if (boothRS.EC !== 0) {
        toast.error(boothRS.EM);
        this.props.dispatchLoaded();
      } else {
        this.setState({
          list: [...boothRS.data.boothes],
        });
        this.props.dispatchLoaded();
      }
    });
  };
  render() {
    if (this.props.loading) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <Box m="auto" minWidth="800px" my="30px" className="white-background">
          {this.state.list.length > 0 ? (
            <Box display="flex" flexWrap="wrap">
              {this.state.list.map((booth, index) => {
                return (
                  <OneBooth
                    booth={booth}
                    key={index}
                    onOpenModal={() => this.onOpenDetailModal(index)}
                  />
                );
              })}
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="400px"
              className="white-background"
            >
              <Box>
                <h1 className="color-aaa">
                  Không có gian hàng nào để hiển thị
                </h1>
              </Box>
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  className="backgroundcolor-orange color-white"
                  onClick={() => {
                    window.location.href = "/m/booth/register";
                  }}
                >
                  <Add />
                  Thêm gian hàng mới
                </Button>
              </Box>
            </Box>
          )}
          <ModalShowBooth
            show={this.state.showBoothDetail}
            onClose={this.onCloseModal}
            booth={this.state.list[this.state.selectedBoothIndex]}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ListBoothes);
