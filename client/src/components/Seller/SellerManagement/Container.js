import { Box, Container, Divider } from "@material-ui/core";
import React, { Component } from "react";
import NavigationBar from "./NavigationBar/NavigationBar";
import Header from "../../header/Container";
import OrderManagement from "./OrderManagement/OrderManagement";
import { Config } from "../../../config/Config";
import ProductManagement from "./ProductManagement/ProductManagement";
import ConversationList from "./Chat/ConversationList";
import ListBoothes from "./MyBooth/ListBoothes";
import Conversation from "./Chat/Conversation";

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
    main: <OrderManagement />,
    content: strings.orderManagementContent,
    key: "order",
  },
  {
    main: <ProductManagement />,
    content: strings.productManagementContent,
    key: "product",
  },
  {
    main: <ConversationList />,
    content: strings.messageContent,
    key: "conversations",
  },
  {
    main: <div>infor main div</div>,
    content: strings.boothInforManagementContent,
    key: "infor",
  },
  {
    main: <div>finance main div</div>,
    content: strings.financeContent,
    key: "finance",
  },
  {
    main: <ListBoothes />,
    content: strings.boothContent,
    key: "booth",
  },
  {
    main: <Conversation />,
    content: strings.boothContent,
    key: "chat",
  },
];

class BoothManageContainer extends Component {
  state = {
    mainComponent: <OrderManagement />,
  };
  componentDidMount() {
    // this.props.socket.emit("message", { data: "hello" });
    let main = directions.filter(
      (direct) => direct.key === this.props.match.params.key
    )[0];
    this.setState({
      mainComponent: main.main,
    });
  }
  changeMainComponent = (key) => {
    window.location.href = "/m/manage/" + key;
  };
  render() {
    return (
      <Box
        maxWidth="xl"
        minWidth="1325px"
        minHeight="100%"
        display="flex"
        flexDirection="column"
        // pt="200px"
        className="grey-background"
      >
        <Header />
        <Box px={2}>
          <h1>Tài khoản của tôi</h1>
          <Divider />
        </Box>
        <Box display="flex" flexGrow={1} mt={2}>
          <NavigationBar
            keyParam={this.props.match.params.key}
            changeMainComponent={this.changeMainComponent}
          />
          <Container className="grey-background">
            {React.cloneElement(this.state.mainComponent, {
              socket: this.props.socket,
            })}
          </Container>
        </Box>
      </Box>
    );
  }
}

export default BoothManageContainer;
