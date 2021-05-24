import { Box, Button, IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { Component } from "react";
import logo from "../../images/Hanoi_Buffaloes_logo.png";

class SimpleHeader extends Component {
  state = {
    keyword: "",
  };
  onChangeKeyword = (e) => {
    this.setState({
      keyword: e.target.value,
    });
  };
  onSearch = () => {
    window.location.href = "/search/" + this.state.keyword + "/20";
  };
  render() {
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
          <span>
            <h2>{this.props.title}</h2>
            {this.props.miniTitle ? (
              <small>
                <i>{this.props.miniTitle}</i>
              </small>
            ) : null}
          </span>
        </Box>
        <Box display="flex" width="400px" alignItems="center">
          <Paper component="form" className="simpleheader-search-paper">
            <InputBase
              placeholder="Tìm kiếm sản phẩm"
              value={this.state.keyword}
              onChange={this.onChangeKeyword}
              className="simpleheader-search-input"
            />
          </Paper>
          <Box px={1} py={3}>
            <Button variant="contained" color="primary" onClick={this.onSearch}>
              <Search fontSize="large" />
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default SimpleHeader;
