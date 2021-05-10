import { Box } from "@material-ui/core";
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
