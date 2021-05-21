import { Box, Divider, Typography } from "@material-ui/core";
import React, { Component } from "react";
import OneProduct from "../../general/OneProduct";
import {
  rcmGuestItems,
  rcmSameLocationPros,
  rcmUserBaseOnHistory,
  rcmUserItems,
} from "../../../apis/item-pool/ItemPool";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAction } from "../../../redux/actions/UserAction";
import { connect } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../../general/Loading";
import cNd from "../../../others/convincesAndDistricts.json";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

class Recomendation extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchLoading();
  }
  state = {
    items: [],
    nearmeProducts: [],
    preferPros: [],
    near_page: 1,
    locate_page: 1,
    history_page: 1,
    popular_page: 1,
    pagesize: 24,
  };
  getLocationForClient = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {});
    } else {
      toast.error("Trình duyệt của bạn không hỗ trợ Geolocation");
    }
  };
  componentDidMount() {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/user/CLIENT";
      this.props.dispatchAuthen(path, "GET", (authRS) => {
        if (authRS.EC !== 0) {
          // document.cookie = "";
          toast.error(authRS.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
        } else {
          rcmUserBaseOnHistory(
            this.state.history_page,
            this.state.pagesize
          ).then((rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
            } else {
              rcmSameLocationPros(
                convincesAndDistricts[1].districts[
                  this.props.address.districtInd
                ].streets[this.props.address.streetInd].name,
                convincesAndDistricts[1].districts[
                  this.props.address.districtInd
                ].name
              ).then((pross) => {
                this.setState({
                  items: [...rs.data.products],
                  nearmeProducts: [...pross.data.products],
                });
              });
              this.props.dispatchLoaded();
            }
          });
        }
      });
    } else {
      rcmGuestItems(this.state.popular_page, this.state.pagesize, (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          this.setState({
            username: "",
            password: "",
          });
          this.props.dispatchLoaded();
        } else {
          this.setState({
            items: [...rs.data.products],
          });
          this.props.dispatchLoaded();
        }
      });
    }
    // BILLING REQUIRED FOR GOOGLE MAP SERVICES
    // fetch(
    //   "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyCUneKSCHxd1nc-3XBG8JSW5ygBhCcNkdU"
    // )
    //   .then((res) => res.json())
    //   .then((rs) => {
    //     console.log(rs);
    //   });
  }
  onClickProduct = (proID) => {
    window.location.href = "/prd/" + proID;
  };
  render() {
    return this.props.loading ? (
      <Box>
        <ToastContainer />
        <Loading />
      </Box>
    ) : (
      <Box mt={2}>
        <ToastContainer />
        <Box p={2} className="white-background color-orange">
          <big>GỢI Ý HÔM NAY</big>
        </Box>
        <Divider />
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {this.state.items.map((item, index) => {
            return (
              <OneProduct
                key={index}
                item={item}
                WIDTH={200}
                onClickProduct={() => this.onClickProduct(item._id)}
              />
            );
          })}
        </Box>
        <Box p={2} mt={2} className="white-background color-orange">
          <big>GẦN BẠN</big>
        </Box>
        <Divider />
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {this.state.nearmeProducts.map((item, index) => {
            return (
              <OneProduct
                key={index}
                item={item}
                WIDTH={200}
                onClickProduct={() => this.onClickProduct(item._id)}
              />
            );
          })}
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
    loading: state.general.loading,
    address: state.user.address,
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

export default connect(mapStateToProps, mapDispatchToProps)(Recomendation);
