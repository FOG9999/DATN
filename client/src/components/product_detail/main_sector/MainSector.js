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
  Movie,
  // PlusOneOutlined,
  Remove,
} from "@material-ui/icons";
import React, { Component } from "react";
import {
  getPrdByID,
  getPrdByIDForUser,
} from "../../../apis/item-pool/ItemPool";
import { turnNumberToNumberWithSeperator } from "../../../others/functions/checkTextForNumberInput";
import { connect } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../../general/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAction } from "../../../redux/actions/UserAction";
import {
  addToCart,
  placeSelfDeliOrder,
} from "../../../apis/user-pool/UserPool";
import ModalChangeLocation from "../../general/modal-location/ModalChangeLocation";
// import { getCookie } from "../../../others/functions/Cookie";
import cNd from "../../../others/convincesAndDistricts.json";
import { getCookie } from "../../../others/functions/Cookie";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));

const BIG_WIDTH = 480;
// SMALL_WIDTH = 92;

const strings = {
  overLimit: "Vượt quá số lượng hàng đang có",
  onlyNumber: "Chỉ được nhập số",
};

class MainSector extends Component {
  state = {
    curr_image: 0,
    startImgInd: 0,
    orderQuantity: 1,
    withDeliver: true,
    product: null,
    location: {
      detail: this.props.address.detail ? this.props.address.detail : "",
      streetIndex: this.props.address.streetInd
        ? this.props.address.streetInd
        : 0,
      districtIndex: this.props.address.districtInd
        ? this.props.address.districtInd
        : 0,
    },
    showModalLocation: false,
  };
  onOpenModalLocation = () => {
    this.setState({
      showModalLocation: true,
    });
  };
  getLocation = (location) => {
    this.setState({
      location: { ...location },
      showModalLocation: false,
    });
  };
  onHideModalLocation = () => {
    this.setState({
      showModalLocation: false,
    });
  };
  onChangeInputField = (e) => {
    if (e.target.name === "orderQuantity" && /\D/.test(e.target.value)) {
      toast.error(strings.onlyNumber);
    } else {
      let value = e.target.value;
      console.log(e.target.type);
      switch (e.target.type) {
        case "number": {
          value = parseInt(value);
          break;
        }
        case "radio": {
          value = e.target.value === "true";
          break;
        }
        default:
          break;
      }
      this.setState({
        [e.target.name]: value,
      });
    }
  };
  placeSelfDeliOrder = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/create/CLIENT/self-deli";
      this.props.dispatchAuthen(path, "PUT", (authRS) => {
        if (authRS.EC !== 0) {
          toast.error(authRS.EM);
          setTimeout(() => {
            this.props.dispatchLogout(() => {
              toast.error("You are logged out!");
              this.props.dispatchLoaded();
            });
          }, 1000);
        } else {
          placeSelfDeliOrder(
            [this.state.product._id],
            this.state.orderQuantity,
            this.state.product.type,
            {
              detail: this.state.location.detail,
              district:
                convincesAndDistricts[1].districts[
                  this.state.location.districtIndex
                ].name,
              street:
                convincesAndDistricts[1].districts[
                  this.state.location.districtIndex
                ].streets[this.state.location.streetIndex].name,
            },
            // `${this.state.detail}, đường ${
            //   convincesAndDistricts[1].districts[
            //     this.state.location.districtIndex
            //   ].streets[this.state.location.streetIndex].name
            // }, quận ${
            //   convincesAndDistricts[1].districts[
            //     this.state.location.districtIndex
            //   ].name
            // }, thành phố Hà Nội`,
            (rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
              } else {
                console.log(rs.data);
                toast.success(
                  "Đặt hàng thành công. Chờ phản hồi từ người bán..."
                );
                this.props.dispatchLoaded();
              }
            }
          );
        }
      });
    } else {
      toast.error("Bạn chưa đăng nhập");
    }
  };
  onPlaceOrder = () => {
    if (this.state.withDeliver) {
      this.addToCart();
    } else {
      this.placeSelfDeliOrder();
    }
  };
  addToCart = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/add-cart/CLIENT";
      this.props.dispatchAuthen(path, "PUT", (authRS) => {
        if (authRS.EC !== 0) {
          toast.error(authRS.EM);
          setTimeout(() => {
            this.props.dispatchLogout(() => {
              toast.error("You are logged out!");
              this.props.dispatchLoaded();
            });
          }, 1000);
        } else {
          addToCart(
            this.props.proID,
            this.state.product.type,
            this.state.orderQuantity,
            this.state.location,
            (rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
                setTimeout(() => {
                  this.props.dispatchLogout(() => {
                    toast.error("You are logged out!");
                    this.props.dispatchLoaded();
                  });
                }, 1000);
              } else {
                this.props.dispatchAddToCart(rs.data.cartNum);
                toast.success("Thêm vào giỏ hàng thành công");
              }
            }
          );
        }
      });
    } else {
      toast.error("Bạn chưa đăng nhập");
    }
  };
  componentDidMount() {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/user-view/" + this.props.proID + "/CLIENT";
      this.props.dispatchAuthen(path, "GET", (authRS) => {
        if (authRS.EC !== 0) {
          toast.error(authRS.EM);
          setTimeout(() => {
            this.props.dispatchLogout(() => {
              toast.error("You are logged out!");
              this.props.dispatchLoaded();
            });
          }, 1000);
        } else {
          getPrdByIDForUser(this.props.proID, (rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
              setTimeout(() => (window.location.href = "/"), 3000);
            } else {
              this.setState({
                product: { ...rs.data[0] },
              });
              this.props.getProDesc(rs.data[0].description);
              this.props.dispatchLoaded();
            }
          });
        }
      });
    } else {
      getPrdByID(this.props.proID, (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          setTimeout(() => (window.location.href = "/"), 3000);
        } else {
          this.setState({
            product: { ...rs.data[0] },
          });
          this.props.getProDesc(rs.data[0].description);
          this.props.dispatchLoaded();
        }
      });
    }
  }
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
    if (this.state.orderQuantity < this.state.product.quantity)
      this.setState({
        orderQuantity: ++this.state.orderQuantity,
      });
    else {
      toast.error(strings.overLimit);
    }
  };
  onMinusOneOrderQuantity = () => {
    this.setState({
      orderQuantity: --this.state.orderQuantity,
    });
  };
  render() {
    return this.state.product !== null ? (
      <Box>
        <ToastContainer />
        <Box px={2} py={2} display="flex">
          <Box px={1}>
            <a href="/" className="link-no-text-decoration">
              Trang chủ
            </a>
          </Box>{" "}
          <ArrowForwardIos />
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              {this.state.product.type === "I" ? "Vật phẩm" : "Thực phẩm"}
            </a>
          </Box>{" "}
          <ArrowForwardIos />
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              {this.state.product.category}
            </a>
          </Box>{" "}
          <ArrowForwardIos />
          <Box px={1}>
            <a href="#" className="link-no-text-decoration">
              {/* {faker.commerce.productName()} */}
              {this.state.product.title}
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
              {!this.state.product.images[this.state.curr_image].link.includes(
                "webm"
              ) &&
              !this.state.product.images[this.state.curr_image].link.includes(
                ".mp4"
              ) ? (
                <img
                  src={this.state.product.images[this.state.curr_image].link}
                  className="pro-detail-main-img"
                  alt=""
                />
              ) : (
                <video
                  controls
                  muted
                  src={this.state.product.images[this.state.curr_image].link}
                  width="480px"
                  height="480px"
                ></video>
              )}
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              className="x-overflow-onhover"
            >
              {this.state.product.images.map((image, index) => {
                return index >= this.state.startImgInd &&
                  index < this.state.startImgInd + 5 ? (
                  <Box className="pro-detail-small-image cursor-pointer">
                    {!this.state.product.images[
                      this.state.curr_image
                    ].link.includes("mp4") &&
                    !this.state.product.images[
                      this.state.curr_image
                    ].link.includes("webm") ? (
                      <img
                        src={image.link}
                        onClick={() => this.onClickImg(index)}
                        key={index}
                        alt=""
                        className="pro-detail-small-image-img"
                      />
                    ) : (
                      <Movie
                        fontsize="large"
                        onClick={() => this.onClickImg(index)}
                        key={index}
                      />
                    )}
                  </Box>
                ) : null;
              })}
            </Box>
          </Box>
          <Box px={5}>
            <Box px={2}>
              <h2>{this.state.product.title}</h2>
              <span className="color-aaa">
                {this.state.product.views} lượt xem
              </span>
            </Box>
            <Box px={2}>
              <h1 className="color-orange">
                đ{turnNumberToNumberWithSeperator(this.state.product.price)}
              </h1>
            </Box>
            <Box px={2}>
              {`${this.state.product.location.detail}, đường ${this.state.product.location.street}, quận ${this.state.product.location.district}, thành phố Hà Nội`}
            </Box>
            <Box px={2} py={3} display="flex">
              <Box display="flex" pr="40px" alignItems="center">
                Vận Chuyển
              </Box>
              <Box>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="withDeliver"
                    value={this.state.withDeliver}
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
            <ModalChangeLocation
              title="Thay đổi địa chỉ giao hàng"
              location={this.state.location}
              show={this.state.showModalLocation}
              onHide={this.onHideModalLocation}
              getLocation={this.getLocation}
            />
            <Box display="flex" px={2} py={1}>
              <Box pr={4} display="flex" alignItems="center">
                Địa chỉ giao hàng
              </Box>
              <Box pr={4} display="flex" alignItems="center">
                {this.state.location.detail}, đường{" "}
                {
                  convincesAndDistricts[1].districts[
                    this.state.location.districtIndex
                  ].streets[this.state.location.streetIndex].name
                }
                , quận{" "}
                {
                  convincesAndDistricts[1].districts[
                    this.state.location.districtIndex
                  ].name
                }
                , thành phố Hà Nội
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onOpenModalLocation}
                >
                  Sửa
                </Button>
              </Box>
            </Box>
            <Box display="flex" px={2} py={1}>
              <Box pr={4} display="flex" alignItems="center">
                Số Lượng
              </Box>
              <Box pr={4} display="flex">
                <IconButton
                  onClick={this.onMinusOneOrderQuantity}
                  disabled={this.state.orderQuantity === 1}
                >
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
                {this.state.product.quantity} sản phẩm có sẵn
              </Box>
            </Box>
            <Box display="flex" mt="30px" px={2}>
              <Button
                variant="contained"
                className="backgroundcolor-orange color-white btn-order-now"
                onClick={this.onPlaceOrder}
                disabled={this.state.product.seller === getCookie("user_id")}
              >
                <big>Đặt hàng ngay</big>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    ) : (
      <Box>
        <ToastContainer />
        <Loading />
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.general.loading,
    logged: state.user.logged,
    address: { ...state.user.address },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAuthen: (path, method, done) => {
      dispatch(UserAction.authen(path, method, done));
    },
    dispatchLoading: () => {
      dispatch(GeneralAction.loading());
    },
    dispatchLoaded: () => {
      dispatch(GeneralAction.loaded());
    },
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
    dispatchAddToCart: (cartNum) => {
      dispatch(UserAction.addToCart(cartNum));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainSector);
