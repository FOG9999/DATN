import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { searchNoCookie } from "../../../apis/item-pool/ItemPool";
import { getCookie } from "../../../others/functions/Cookie";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { UserAction } from "../../../redux/actions/UserAction";
import Loading from "../../general/Loading";
import OneProduct from "../../general/OneProduct";

class Recomendation extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  state = {
    products: [],
  };
  componentDidMount() {
    this.props.dispatchLoading();
    searchNoCookie(
      1,
      this.props.limit,
      this.props.keyword,
      "",
      "",
      this.props.logged ? getCookie("user_id") : "",
      (rs) => {
        if (rs.EC !== 0) {
          this.props.dispatchLoaded();
          toast.error(rs.EM);
        } else {
          this.setState({
            products: [...rs.data.products],
          });
          this.props.dispatchLoaded();
        }
      }
    );
  }
  onClickProduct = (proID) => {
    window.location.href = "/prd/" + proID;
  };
  render() {
    if (this.props.loading)
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    else
      return (
        <Box mt={2} flexGrow={1}>
          <Box p={2} className="white-background color-orange">
            <big>KẾT QUẢ TÌM KIẾM CHO BẠN</big>
          </Box>
          <Divider />
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {this.state.products.map((item, index) => {
              return (
                <OneProduct
                  item={item}
                  key={index}
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

export default connect(mapStateToProps, mapDispatchToProps)(Recomendation);
