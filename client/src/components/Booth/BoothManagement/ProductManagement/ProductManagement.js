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
import { items } from "../../../../others/test/Orders";
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
  "Sách truyện",
  "Nhà bếp",
  "Phụ kiện trang bị",
  "Đồ dùng trong nhà",
];
const foodCategories = ["Rau xanh", "Hoa quả", "Trứng", "Thủy sản"];

class ProductManagement extends Component {
  state = {
    categories: [],
    selectedType: "",
    selectedCate: "",
    selectedTab: 0,
    page: 1,
    pagesize: 5,
    numOfProducts: 19,
  };
  onChangeSearchTitle = (e) => {};
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
  resetSearch = () => {
    this.setState({
      selectedType: "",
      selectedCate: "",
      categories: [],
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
  render() {
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
                value={this.state.searchKeyword}
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
              <Button className="backgroundcolor-orange color-white">
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
            <h2>{this.state.numOfProducts} đơn hàng</h2>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              className="backgroundcolor-orange color-white"
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
          {items()
            .slice(0, Math.round(Math.random() * 10))
            .map((item, index) => {
              return <RowData item={item} key={index} />;
            })}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <Box mr={2}>Trang</Box>
          <Box display="flex">
            <IconButton
              // onClick={this.onClickPreviousPage}
              disabled={this.state.page <= 0}
            >
              <ArrowBackIos />
            </IconButton>
            <Box px={3} display="flex" alignItems="center">
              {this.state.page}
            </Box>
            <IconButton
            // onClick={this.onClickNextPage}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default ProductManagement;
