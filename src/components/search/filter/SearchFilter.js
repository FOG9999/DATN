import { Box, Button, Divider, TextField, Checkbox } from "@material-ui/core";
import React, { Component } from "react";
import RecommendKeyWrods from "./RecommendKeyWords";
import { FilterList } from "@material-ui/icons";
import cNd from "../../../others/convincesAndDistricts.json";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

const keywords = ["Áo thun", "Áo bò nam", "Áo cộc tay", "Khác"];

class SearchFilter extends Component {
  state = {};
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
        </Box>
        <RecommendKeyWrods keywords={keywords} />
        <Divider />
        <Box>
          <Box pt={1} px={2}>
            Nơi bán
          </Box>
          <Box>
            <ul className="list-style-type-none">
              {convincesAndDistricts[1].districts.map((district, index) => {
                return (
                  <li key={index} className="padding-block-start-zero">
                    <Checkbox /> <span>{district.name}</span>
                  </li>
                );
              })}
            </ul>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Box px={2} py={1}>
            Khoảng giá
          </Box>
          <Box display="flex" py={1} px={2}>
            <Box width="70px">
              <TextField placeholder="&TỪ" />
            </Box>
            <Box px={2}>-</Box>
            <Box width="70px">
              <TextField placeholder="&ĐẾN" />
            </Box>
          </Box>
          <Box display="flex" px={2} py={1}>
            <Button className="backgroundcolor-orange searchfilter-btn-apply">
              ÁP DỤNG
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default SearchFilter;
