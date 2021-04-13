import { Box } from "@material-ui/core";
import React, { Component } from "react";
import {
  AttachMoneyOutlined,
  DescriptionOutlined,
  EventAvailableOutlined,
  MessageOutlined,
  StorageOutlined,
  StorefrontOutlined,
} from "@material-ui/icons";
import OneDirection from "./OneDirection";
import OrderManagement from "../OrderManagement/OrderManagement";
import ProductManagement from "../ProductManagement/ProductManagement";

const strings = {
  orderManagementContent: "Đơn hàng của tôi",
  messageContent: "Tin nhắn",
  productManagementContent: "Sản phẩm đã đăng",
  boothInforManagementContent: "Thông tin tài khoản",
  financeContent: "Tài chính",
  dataContent: "Dữ liệu",
};

const directions = [
  {
    icon: <DescriptionOutlined />, // Order management
    main: <OrderManagement />,
    content: strings.orderManagementContent,
  },
  {
    icon: <EventAvailableOutlined />, // Product management
    main: <ProductManagement />,
    content: strings.productManagementContent,
  },
  {
    icon: <MessageOutlined />, // message
    main: <div>message main div</div>,
    content: strings.messageContent,
  },
  {
    icon: <StorefrontOutlined />, // information management
    main: <div>infor main div</div>,
    content: strings.boothInforManagementContent,
  },
  {
    icon: <AttachMoneyOutlined />, // finance
    main: <div>finance main div</div>,
    content: strings.financeContent,
  },
  {
    icon: <StorageOutlined />, // data
    main: <div>data main div</div>,
    content: strings.dataContent,
  },
];

class NavigationBar extends Component {
  state = {
    selectedIndex: -1,
  };
  onClick = (index) => {
    this.props.changeMainComponent(directions[index].main);
    this.setState({
      selectedIndex: index,
    });
  };
  render() {
    return (
      <Box
        minWidth="250px"
        height="100%"
        // style={{ position: "fixed", top: "0px" }}
        // borderRight="1px solid #aaa"
      >
        {directions.map((direction, index) => {
          return (
            <OneDirection
              selected={this.state.selectedIndex === index}
              onClick={() => this.onClick(index)}
              direction={direction}
              key={index}
            />
          );
        })}
      </Box>
    );
  }
}

export default NavigationBar;
