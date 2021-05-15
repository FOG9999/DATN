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
import ListBoothes from "../MyBooth/ListBoothes";
import ConversationList from "../Chat/ConversationList";

const strings = {
  orderManagementContent: "Quản lý đơn hàng",
  messageContent: "Tin nhắn",
  productManagementContent: "Quản lý sản phẩm",
  boothInforManagementContent: "Quản lý thông tin",
  financeContent: "Tài chính",
  boothContent: "Các gian hàng",
};

const directions = [
  {
    icon: <DescriptionOutlined />, // Order management
    main: <OrderManagement />,
    content: strings.orderManagementContent,
    key: "order",
  },
  {
    icon: <EventAvailableOutlined />, // Product management
    main: <ProductManagement />,
    content: strings.productManagementContent,
    key: "product",
  },
  {
    icon: <MessageOutlined />, // message
    main: <ConversationList />,
    content: strings.messageContent,
    key: "conversations",
  },
  {
    icon: <StorefrontOutlined />, // information management
    main: <div>infor main div</div>,
    content: strings.boothInforManagementContent,
    key: "infor",
  },
  {
    icon: <AttachMoneyOutlined />, // finance
    main: <div>finance main div</div>,
    content: strings.financeContent,
    key: "finance",
  },
  {
    icon: <StorageOutlined />, // boothes
    main: <ListBoothes />,
    content: strings.boothContent,
    key: "booth",
  },
];

class NavigationBar extends Component {
  state = {
    selectedIndex: 0,
  };
  componentDidMount() {
    let isChatting = true;
    for (let i = 0; i < directions.length; i++) {
      if (directions[i].key === this.props.keyParam) {
        this.setState({
          selectedIndex: i,
        });
        isChatting = false;
        break;
      }
    }
    if (isChatting) {
      this.setState({
        selectedIndex: 2,
      });
    }
  }
  onClick = (index) => {
    this.props.changeMainComponent(directions[index].key);
    this.setState({
      selectedIndex: index,
    });
  };
  render() {
    return (
      <Box
        minWidth="250px"
        className="white-background"
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
