import React, { Component } from "react";
import { Box } from "@material-ui/core";
import SearchFilter from "./filter/SearchFilter";
import SearchResult from "./result/SearchResult";
import HeaderContainer from "../header/Container";
import { UserAction } from "../../redux/actions/UserAction";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import { connect } from "react-redux";
import { getCookie } from "../../others/functions/Cookie";
import { searchNoCookie } from "../../apis/item-pool/ItemPool";
import { toast } from "react-toastify";

class SearchContainer extends Component {
  state = {
    products: [],
  };
  setProducts = () => {
    this.props.dispatchLoading();
    searchNoCookie(
      1,
      this.props.match.params.limit,
      this.props.match.params.keyword,
      "",
      "",
      this.props.logged ? getCookie("user_id") : ""
    ).then((rs) => {
      if (rs.EC !== 0) {
        this.props.dispatchLoaded();
        toast.error(rs.EM);
      } else {
        this.setState({
          products: [...rs.data.products],
        });
        this.props.dispatchLoaded();
      }
    });
  };
  updateProducts = (result) => {
    if (result.EC !== 0) {
      toast.error(result.EM);
      this.props.dispatchLoaded();
    } else {
      this.setState({
        products: [...result.data.products],
      });
      this.props.dispatchLoaded();
    }
  };
  componentDidMount() {
    this.setProducts();
  }
  render() {
    return (
      // <Box display="flex">
      //   <SearchFilter />
      //   <SearchResult
      //     keyword={this.props.match.params.keyword}
      //     limit={this.props.match.params.limit}
      //   />
      // </Box>
      <Box
        maxWidth="xl"
        minWidth="1325px"
        className="home-container"
        // pt="200px"
      >
        <HeaderContainer />
        <Box className="home-box0" display="flex">
          <SearchFilter
            keyword={this.props.match.params.keyword}
            limit={this.props.match.params.limit}
            updateProducts={this.updateProducts}
            setProducts={this.setProducts}
          />
          <SearchResult
            keyword={this.props.match.params.keyword}
            products={this.state.products}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
