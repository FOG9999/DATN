import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import {
  Add,
  ArrowForwardIos,
  LocalShipping,
  PlusOneOutlined,
  Remove,
} from "@material-ui/icons";
import React, { Component } from "react";
import faker from "faker";

const BIG_WIDTH = 480,
  SMALL_WIDTH = 92;

const images = [
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
  faker.image.imageUrl(SMALL_WIDTH, SMALL_WIDTH, "Love", true),
];

class MainSector extends Component {
  state = {
    curr_image: 0,
    startImgInd: 0,
    orderQuantity: 1,
    withDeliver: true,
  };
  onChangeInputField = (e) => {
    this.setState({
      [e.target.name]:
        e.target.type === "number" ? parseInt(e.target.value) : e.target.value,
    });
  };
  onClickImg = (index) => {
    this.setState({
      curr_image: index,
    });
  };
  onCkickRight = () => {
    this.setState({
      startImgInd: (this.state.startImgInd + 1) % 5,
    });
  };
  onCkickLeft = () => {
    this.setState({
      startImgInd: (this.state.startImgInd - 1) % 5,
    });
  };
  onAddOneOrderQuantity = () => {
    this.setState({
      orderQuantity: this.state.orderQuantity++,
    });
  };
  onMinusOneOrderQuantity = () => {
    this.setState({
      orderQuantity: this.state.orderQuantity--,
    });
  };
  render() {
    return (
      <Box>
        <Box px={2} py={2} display="flex">
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              Trang chủ
            </a>
          </Box>{" "}
          <ArrowForwardIos />
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              Giầy dép
            </a>
          </Box>{" "}
          <ArrowForwardIos />
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              {faker.commerce.productName()}
            </a>
          </Box>
        </Box>
        <Box display="flex" p={2} className="white-background">
          <Box width={(BIG_WIDTH + 20).toString() + "px"}>
            <Box
              display="flex"
              justifyContent="center"
              p="10px"
              alignItems="center"
            >
              <img
                src={images[this.state.curr_image]}
                className="pro-detail-main-img"
                alt=""
              />
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              className="x-overflow-onhover"
            >
              {images.map((image, index) => {
                return index >= this.state.startImgInd &&
                  index < this.state.startImgInd + 5 ? (
                  <Box className="pro-detail-small-image cursor-pointer">
                    <img
                      src={image}
                      onClick={() => this.onClickImg(index)}
                      key={index}
                      alt=""
                    />
                  </Box>
                ) : null;
              })}
            </Box>
          </Box>
          <Box px={5}>
            <Box px={2}>
              <h1>{faker.commerce.productName()}</h1>
              <span className="color-aaa">1000 lượt xem</span>
            </Box>
            <Box px={2}>
              <h1 className="color-orange">
                đ{Math.ceil(Math.random() * 1000).toString() + ".000"}
              </h1>
            </Box>
            <Box px={2}>
              Số 37 Ngõ Kiến Thiết, 102 Đại La, Quận Hai Bà Trưng, Hà Nội
            </Box>
            <Box px={2} py={3} display="flex">
              <Box display="flex" pr="40px" alignItems="center">
                Vận Chuyển
              </Box>
              <Box>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="withDeliver"
                    value={true}
                    onChange={this.onChangeInputField}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Vận chuyển tới cho tôi"
                    />
                    <Box display="flex">
                      <LocalShipping />
                      <Box ml={2} className="color-aaa">
                        Hàng sẽ được vận chuyển trong vòng 2 ngày kể từ khi được
                        xác nhận
                      </Box>
                    </Box>
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Tôi sẽ tự lấy hàng"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" px={2} py={1}>
              <Box pr={4} display="flex" alignItems="center">
                Số Lượng
              </Box>
              <Box pr={4} display="flex">
                <IconButton onClick={this.onMinusOneOrderQuantity}>
                  <Remove />
                </IconButton>
                <input
                  type="text"
                  value={this.state.orderQuantity}
                  onChange={this.onChangeInputField}
                  name="orderQuantity"
                  className="text-center input-order-quantity"
                />
                <IconButton>
                  <Add onClick={this.onAddOneOrderQuantity} />
                </IconButton>
              </Box>
              <Box
                pr={4}
                display="flex"
                alignItems="center"
                className="color-aaa"
              >
                3 sản phẩm có sẵn
              </Box>
            </Box>
            <Box display="flex" mt="30px" px={2}>
              <Button
                variant="contained"
                className="backgroundcolor-orange color-white btn-order-now"
              >
                <big>Đặt hàng ngay</big>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default MainSector;
