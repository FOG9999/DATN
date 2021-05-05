import { Box, Divider, Typography } from "@material-ui/core";
import React, { Component } from "react";
import OneProduct from "../../general/OneProduct";
import { rcmGuestItems, rcmUserItems } from "../../../apis/item-pool/ItemPool";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAction } from "../../../redux/actions/UserAction";
import { connect } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../../general/Loading";

class Recomendation extends Component {
  constructor(props) {
    super(props);
    this.props.dispatchLoading();
  }
  state = {
    items: [],
  };
  componentDidMount() {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/user/CLIENT";
      this.props.dispatchAuthen(path, "GET", (authRS) => {
        if (authRS.EC !== 0) {
          document.cookie = "";
          toast.error(authRS.EM);
          this.props.dispatchLoaded();
        } else {
          rcmUserItems((rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
            } else {
              this.setState({
                items: [...rs.data],
              });
              this.props.dispatchLoaded();
            }
          });
        }
      });
    } else {
      rcmGuestItems((rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          this.setState({
            username: "",
            password: "",
          });
          this.props.dispatchLoaded();
        } else {
          this.setState({
            items: [...rs.data],
          });
          this.props.dispatchLoaded();
        }
      });
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Recomendation);
