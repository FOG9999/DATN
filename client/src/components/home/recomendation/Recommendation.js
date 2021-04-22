import { Box, Divider, Typography } from "@material-ui/core";
import React, { Component } from "react";
import OneProduct from "../../general/OneProduct";
import { rcmGuestItems, rcmUserItems } from "../../../apis/item-pool/ItemPool";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAction } from "../../../redux/actions/UserAction";
import { connect } from "react-redux";

class Recomendation extends Component {
  state = {
    items: [],
  };
  componentDidMount() {
    if (this.props.logged) {
      const path = "/user/CLIENT";
      this.props.dispatchAuthen(path, "GET", (authRS) => {
        if (authRS.EC !== 0) {
          document.cookie = "";
        } else {
          rcmUserItems((rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
            } else {
              this.setState({
                items: [...rs.data],
              });
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
        } else {
          this.setState({
            items: [...rs.data],
          });
        }
      });
    }
  }
  render() {
    return (
      <Box mt={2}>
        <ToastContainer />
        <Box p={2} className="white-background color-orange">
          <big>GỢI Ý HÔM NAY</big>
        </Box>
        <Divider />
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {this.state.items.map((item, index) => {
            return <OneProduct key={index} item={item} WIDTH={200} />;
          })}
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAuthen: (path, method, done) => {
      dispatch(UserAction.authen(path, method, done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recomendation);
