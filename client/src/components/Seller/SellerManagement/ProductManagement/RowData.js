import { Box } from "@material-ui/core";
import React, { Component } from "react";

class RowData extends Component {
  state = {};
  displayType = (type) => {
    switch (type) {
      case "F": {
        return "Thực phẩm";
      }
      case "I": {
        return "Vật phẩm";
      }
      default:
        break;
    }
  };
  render() {
    return (
      <Box border="1px solid #e8e8e8" mt={2}>
        <Box display="flex" borderBottom="1px solid #e8e8e8">
          <Box display="flex" width="35%" alignItems="center" py={1}>
            <Box display="flex" justifyContent="center" width="20%">
              <img
                style={{ width: "50px", height: "50px" }}
                src={this.props.item.images[0].link}
                alt=""
              />
            </Box>
            <Box flexGrow="1">
              <Box p={1}>
                <b>{this.props.item.title}</b>
              </Box>
              <Box p={1}>
                <small>Chủng loại: {this.props.item.category}</small>
              </Box>
            </Box>
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {this.displayType(this.props.item.type)}
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {new Date(this.props.item.createdAt).toLocaleDateString()}
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {this.props.item.quantity}
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            {this.props.item.sold}
          </Box>
          <Box display="flex" width="15%" alignItems="center">
            <span className="cursor-pointer color-blue">Xem thêm</span>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default RowData;
