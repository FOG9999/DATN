import {
  Box,
  Button,
  Divider,
  TextField,
  Checkbox,
  Radio,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import React, { Component } from "react";
import RecommendKeyWrods from "./RecommendKeyWords";
import {
  FilterList,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Replay,
} from "@material-ui/icons";
import cNd from "../../../others/convincesAndDistricts.json";
import { toast } from "react-toastify";
import {
  turnNumberToNumberWithSeperator,
  turnNumberWithSeperatorIntoNumber,
} from "../../../others/functions/checkTextForNumberInput";
import { connect } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { search, searchNoCookie } from "../../../apis/item-pool/ItemPool";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

const keywords = ["Áo thun", "Áo bò nam", "Áo cộc tay", "Khác"];

class SearchFilter extends Component {
  state = {
    selectedKeyword: "",
    selectedDistrict: "",
    min: "",
    max: "",
    filterHeight: "190px",
  };
  onChangeInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onChangeNumberInput = (e) => {
    let replacement = e.target.value.replace(".", "");
    replacement = replacement.replace(/\d/g, "");
    if (/\D/.test(replacement)) {
      toast.error("Chỉ nhập số cho trường này!");
    } else {
      this.setState({
        [e.target.name]: turnNumberWithSeperatorIntoNumber(e.target.value),
      });
    }
  };
  applySearch = () => {
    this.props.dispatchLoading();
    const { selectedKeyword, selectedDistrict, min, max } = this.state;
    searchNoCookie(
      1,
      this.props.limit,
      this.state.selectedKeyword
        ? this.state.selectedKeyword
        : this.props.keyword,
      "",
      "",
      "",
      selectedDistrict ? selectedDistrict : "",
      min,
      max
    ).then((rs) => {
      this.props.updateProducts(rs);
    });
  };
  onExpandDistrictFilter = () => {
    this.setState({
      filterHeight: "fit-content",
    });
  };
  onNarrowDistrictFilter = () => {
    this.setState({
      filterHeight: "190px",
    });
  };
  refreshSearchFilter = () => {
    this.props.setProducts();
    this.setState({
      selectedKeyword: "",
      selectedDistrict: "",
      min: "",
      max: "",
    });
  };
  render() {
    return (
      <Box>
        <Box p={1} display="flex">
          <Box mr={1}>
            <FilterList />
          </Box>
          <Box>
            <b>BỘ LỌC TÌM KIẾM</b>
          </Box>
          <Box px={1}>
            <Replay
              className="cursor-pointer"
              onClick={this.refreshSearchFilter}
            />
          </Box>
        </Box>
        <RecommendKeyWrods keywords={keywords} />
        <Divider />
        <Box>
          <Box pt={1} px={2}>
            Nơi bán
          </Box>
          <Box height={this.state.filterHeight} style={{ overflowY: "hidden" }}>
            <ul className="list-style-type-none">
              {convincesAndDistricts[1].districts.map((district, index) => {
                return (
                  <li key={index} className="padding-block-start-zero">
                    <Radio
                      checked={this.state.selectedDistrict === district.name}
                      name="selectedDistrict"
                      onChange={this.onChangeInput}
                      value={district.name}
                    />{" "}
                    <span>{district.name}</span>
                  </li>
                );
              })}
            </ul>
          </Box>
          <Box display="flex" justifyContent="center">
            {this.state.filterHeight === "190px" ? (
              <IconButton size="small" onClick={this.onExpandDistrictFilter}>
                <KeyboardArrowDown />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={this.onNarrowDistrictFilter}>
                <KeyboardArrowUp />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider />
        <Box>
          <Box px={2} py={1}>
            Khoảng giá
          </Box>
          <Box display="flex" py={1} px={2}>
            <Box width="70px">
              <TextField
                value={turnNumberToNumberWithSeperator(this.state.min)}
                name="min"
                onChange={this.onChangeNumberInput}
                placeholder="&TỪ"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box px={2}>-</Box>
            <Box width="70px">
              <TextField
                value={turnNumberToNumberWithSeperator(this.state.max)}
                name="max"
                onChange={this.onChangeNumberInput}
                placeholder="&ĐẾN"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          <Box display="flex" px={2} py={1}>
            <Button
              onClick={this.applySearch}
              className="backgroundcolor-orange searchfilter-btn-apply"
            >
              ÁP DỤNG
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);
