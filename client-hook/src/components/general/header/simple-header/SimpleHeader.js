import { Box, Button, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { useState } from "react";
import logo from "../../../../images/Hanoi_Buffaloes_logo.png";

function SimpleHeader(props) {
  const [keyword, setKeyword] = useState("");
  function onChangeKeyword(e) {
    setKeyword(e.target.value);
  }
  function onSearch() {
    // window.location.href = "/search/" + keyword + "/20";
  }
  return (
    <Box display="flex" p={1} className="backgroundcolor-orange">
      <Box display="flex" alignItems="center" justifyContent="center" p={1}>
        <img src={logo} alt="" width="80px" height="80px" />
      </Box>
      <Box
        flexGrow={1}
        pl={3}
        display="flex"
        alignItems="center"
        className="color-white"
      >
        <h2>{props.title}</h2>
      </Box>
      <Box display="flex" width="400px" alignItems="center">
        <Paper component="form" className="simpleheader-search-paper">
          <InputBase
            placeholder="Tìm kiếm sản phẩm"
            value={keyword}
            onChange={onChangeKeyword}
            className="simpleheader-search-input"
          />
        </Paper>
        <Box px={1} py={3}>
          <Button variant="contained" color="primary" onClick={onSearch}>
            <Search fontSize="large" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SimpleHeader;
