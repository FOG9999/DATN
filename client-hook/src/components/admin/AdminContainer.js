import React, { useState } from "react";
import NavigationBar from "../../components/general/navigation-bar/NavigationBar";
import SimpleHeader from "../../components/general/header/simple-header/SimpleHeader";
import {
  Add,
  AssignmentInd,
  DirectionsBike,
  List,
  Message,
  PermIdentity,
  Publish,
  ShoppingCart,
  TrendingUp,
} from "@material-ui/icons";
import { Box, Container } from "@material-ui/core";
import ModeratorAccount from "./moderator-account/ModeratorAccount";
import BoothRegistInspect from "./booth-register-inspect/BoothRegisterInspect";
import PrdUploadInspect from "./product-upload-inspect/PrdUploadInspect";

const directions = [
  {
    icon: <Publish />,
    main: <PrdUploadInspect />,
    content: "Kiểm duyệt đăng tải sản phẩm",
  },
  {
    icon: <Add />,
    main: <BoothRegistInspect />,
    content: "Kiểm duyệt đăng ký gian hàng",
  },
  {
    icon: <PermIdentity />,
    main: <div>My information div</div>,
    content: "Thông tin cá nhân",
  },
  {
    icon: <Message />,
    main: <div>Message div</div>,
    content: "Tin nhắn",
  },
  {
    icon: <AssignmentInd />,
    main: <ModeratorAccount />,
    content: "Tài khoản kiểm duyệt viên",
  },
  {
    icon: <DirectionsBike />,
    main: <div>Driver div</div>,
    content: "Tài khoản tài xế",
  },
  {
    icon: <List />,
    main: <div>Actions tracking div</div>,
    content: "Theo dõi các hoạt động",
  },
  {
    icon: <TrendingUp />,
    main: <div>Product statistic div</div>,
    content: "Thống kê sản phẩm",
  },
  {
    icon: <ShoppingCart />,
    main: <div>Order statistic div</div>,
    content: "Thống kê đơn hàng",
  },
];

function AdminContainer() {
  const [mainComponent, setMainComponent] = useState(null);
  function changeMainComponent(component) {
    setMainComponent(component);
  }
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
      <SimpleHeader title="Chào mừng quản trị viên" />
      <Box display="flex" flexGrow={1} mt={2}>
        <NavigationBar
          directions={directions}
          changeMainComponent={changeMainComponent}
        />
        <Container className="grey-background">{mainComponent}</Container>
      </Box>
    </Box>
  );
}

export default AdminContainer;
