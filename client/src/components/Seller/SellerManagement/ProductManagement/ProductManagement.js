import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";
import {
  Add,
  ArrowBackIos,
  ArrowForwardIos,
  RotateLeft,
  Search,
} from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { search } from "../../../../apis/item-pool/ItemPool";
import { getSellerProducts } from "../../../../apis/user-pool/UserPool";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import Loading from "../../../general/Loading";
import RowData from "../ProductManagement/RowData";
import RowHeader from "./RowHeader";

const strings = {
  allProductHeader: "Tất cả",
  outOfStockHeader: "Hết hàng",
  inStockHeader: "Còn hàng",
};

const tabTitles = [
  { label: strings.allProductHeader, key: "A" },
  { label: strings.outOfStockHeader, key: "O" },
  { label: strings.inStockHeader, key: "I" },
];

const itemCategories = [
  "Quần áo",
  "Đồ trang điểm",
  "Giày dép",
  "Vật dụng",
  "Trang trí",
  "Khác",
];
const foodCategories = [
  "Rau củ quả",
  "Trái cây tươi",
  "Bánh kẹo và snack",
  "Sản phẩm thịt",
];

class ProductManagement extends Component {
  state = {
    categories: [],
    firsttime: true,
    selectedType: "",
    selectedCate: "",
    selectedTab: 0,
    page: 1,
    searchTitle: "",
    pagesize: 10,
    numOfProducts: 0,
    products: [],
    onSearching: false,
  };
  onClickUploadNewProduct = () => {
    window.location.href = "/m/prd/create";
  };
  onChangeSearchTitle = (e) => {
    this.setState({
      searchTitle: e.target.value,
    });
  };
  onChangeSearchType = (e) => {
    if (e.target.checked) {
      switch (e.target.value) {
        case "Vật phẩm": {
          this.setState({
            selectedType: e.target.value,
            categories: [...itemCategories],
          });
          break;
        }
        case "Thực phẩm": {
          this.setState({
            selectedType: e.target.value,
            categories: [...foodCategories],
          });
          break;
        }
        default:
          break;
      }
    }
  };
  onClickSearch = () => {
    this.setState({
      page: 1,
    });
    setTimeout(() => this.onSearch(), 500);
  };
  onSearch = () => {
    this.props.dispatchLoading();
    search(
      this.state.page,
      this.state.pagesize,
      this.state.searchTitle,
      this.state.selectedType === "Vật phẩm"
        ? "I"
        : this.state.selectedType === "Thực phẩm"
        ? "F"
        : "",
      this.state.selectedCate
    ).then((rs) => {
      if (rs.EC !== 0) {
        this.props.dispatchLoaded();
        toast.error(rs.EM);
      } else {
        if (rs.data.products.length > 0) {
          this.setState({
            products: [...rs.data.products],
            numOfProducts: rs.data.numOfProducts,
            onSearching: true,
          });
        } else {
          toast.warn("Không còn sản phẩm để hiển thị");
          this.setState({
            page: this.state.page - 1,
          });
        }
        this.props.dispatchLoaded();
      }
    });
  };
  resetSearch = () => {
    this.setState({
      selectedType: "",
      selectedCate: "",
      categories: [],
      searchTitle: "",
      onSearching: false,
      page: 1,
    });
    this.getProducts((rs) => {
      this.setState({
        products: [...rs.data.products],
        numOfProducts: rs.data.numOfProducts,
      });
      this.props.dispatchLoaded();
    });
  };
  onClickTab = (tabIndex) => {
    this.setState({
      selectedTab: tabIndex,
    });
  };
  onChangeSearchCategory = (e) => {
    this.setState({
      selectedCate: e.target.value,
    });
  };
  onClickPreviousPage = () => {
    if (this.state.onSearching) {
      this.setState({
        page: this.state.page - 1,
      });
      setTimeout(() => this.onSearch(), 500);
    } else {
      this.setState({
        page: this.state.page - 1,
      });
      this.getProducts((rs) => {
        this.setState({
          products: [...rs.data.products],
          numOfProducts: rs.data.numOfProducts,
        });
        this.props.dispatchLoaded();
      });
    }
  };
  onClickNextPage = () => {
    if (this.state.onSearching) {
      this.setState({
        page: this.state.page + 1,
      });
      setTimeout(() => this.onSearch(), 500);
    } else {
      this.setState({
        page: this.state.page + 1,
      });
      this.getProducts((rs) => {
        if (rs.data.products.length > 0) {
          this.setState({
            products: [...rs.data.products],
            numOfProducts: rs.data.numOfProducts,
          });
          this.props.dispatchLoaded();
        } else {
          toast.warn("Không còn sản phẩm để hiển thị");
          this.setState({
            page: this.state.page - 1,
          });
          this.props.dispatchLoaded();
        }
      });
    }
  };
  getProducts = (done) => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/seller/CLIENT/get-all";
      this.props.dispatchAuthen(path, "GET", (auth) => {
        if (auth.EC !== 0) {
          this.props.dispatchLoaded();
          toast.error(auth.EM);
        } else {
          getSellerProducts(this.state.page, this.state.pagesize, (rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
              this.props.dispatchLogout(() => {
                this.props.dispatchLoaded();
                window.location.href = "/";
              });
            } else {
              done(rs);
            }
          });
        }
      });
    }
  };
  componentDidMount() {
    this.getProducts((rs) => {
      this.setState({
        products: [...rs.data.products],
        numOfProducts: rs.data.numOfProducts,
        firsttime: false,
      });
      this.props.dispatchLoaded();
    });
  }
  render() {
    if (this.props.loading || this.state.firsttime) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <Box m="auto" minWidth="800px" my="30px" className="white-background">
          <Box display="flex" borderBottom="1px solid #e8e8e8">
            {tabTitles.map((tab, index) => {
              return (
                <Box
                  py={2}
                  px={3}
                  key={index}
                  style={
                    this.state.selectedTab === index
                      ? { color: "rgb(238, 77, 46)" }
                      : null
                  }
                  onClick={() => this.onClickTab(index)}
                  className="cursor-pointer"
                >
                  <b>{tab.label}</b>
                </Box>
              );
            })}
          </Box>
          <Box px={3}>
            <Box display="flex">
              <Box display="flex" flexGrow="1" alignItems="center">
                <Box display="flex" alignItems="center" pr={2}>
                  Tên sản phẩm
                </Box>
                <TextField
                  size="small"
                  value={this.state.searchTitle}
                  onChange={this.onChangeSearchTitle}
                  placeholder="Tên sản phẩm"
                />
              </Box>
              <Box display="flex" flexGrow="1" alignItems="center">
                <Box display="flex" alignItems="center" pr={2}>
                  Loại sản phẩm
                </Box>
                <Box>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="gender"
                      value={this.state.selectedType}
                      row
                      onChange={this.onChangeSearchType}
                    >
                      <FormControlLabel
                        value="Vật phẩm"
                        control={<Radio />}
                        label="Vật phẩm"
                        checked={this.state.selectedType === "Vật phẩm"}
                      />
                      <FormControlLabel
                        value="Thực phẩm"
                        control={<Radio />}
                        label="Thực phẩm"
                        checked={this.state.selectedType === "Thực phẩm"}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
              <Box display="flex" flexGrow="1">
                <Box display="flex" alignItems="center" pr={2}>
                  Danh mục
                </Box>
                <Box p={1}>
                  <Select
                    value={this.state.selectedCate}
                    onChange={this.onChangeSearchCategory}
                  >
                    {this.state.categories.map((cate, index) => {
                      return (
                        <MenuItem value={cate} key={index}>
                          <Box px={1}>{cate}</Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
              </Box>
            </Box>
            <Box display="flex">
              <Box display="flex" alignItems="center" pr={1} py={1}>
                <Button
                  className="backgroundcolor-orange color-white"
                  onClick={this.onClickSearch}
                >
                  <Search />
                  Tìm
                </Button>
              </Box>
              <Box display="flex" alignItems="center" p={1}>
                <Button
                  onClick={this.resetSearch}
                  className="backgroundcolor-orange color-white"
                >
                  <RotateLeft />
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
          <Box display="flex" px={3}>
            <Box flexGrow="1" display="flex" alignItems="center">
              <h2>{this.state.numOfProducts} sản phẩm</h2>
            </Box>
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                className="backgroundcolor-orange color-white"
                onClick={this.onClickUploadNewProduct}
              >
                <Add />
                Thêm sản phẩm mới
              </Button>
            </Box>
          </Box>
          <Box px={3}>
            <RowHeader />
          </Box>
          <Box px={3}>
            {this.state.products.map((item, index) => {
              return <RowData item={item} key={index} />;
            })}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={2}
          >
            <Box mr={2}>Trang</Box>
            <Box display="flex">
              <IconButton
                onClick={this.onClickPreviousPage}
                disabled={this.state.page === 1}
              >
                <ArrowBackIos />
              </IconButton>
              <Box px={3} display="flex" alignItems="center">
                {this.state.page}
              </Box>
              <IconButton
                onClick={this.onClickNextPage}
                disabled={this.state.products.length === 0}
              >
                <ArrowForwardIos />
              </IconButton>
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
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagement);
