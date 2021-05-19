import { Box } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import Loading from "../../components/general/Loading";
import {
  getCart,
  placeDeliOrder,
  removeFromCart,
} from "../../apis/user-pool/UserPool";
import { UserAction } from "../../redux/actions/UserAction";
import { Config } from "../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import RowHeader from "./RowHeader";
import RowData from "./RowData";
import Header from "../../components/header/Container";
import TotalBar from "./TotalBar";

class CartContainer extends Component {
  state = {
    cart: {},
    checkedArr: [],
    total: 0,
    checkAll: false,
  };
  componentDidMount() {
    this.getCartForUser();
  }
  getCartForUser = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/cart/" + Config.ROLE.CLIENT;
      this.props.dispatchAuthen(path, "GET", (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
          // setTimeout(() => {
          //   window.location.href = "/";
          // }, 3000);
        } else {
          getCart((cartRS) => {
            if (cartRS.EC !== 0) {
              toast.error(cartRS.EM);
              this.props.dispatchLoaded();
            } else {
              let checkedArr = [];
              for (let i = 0; i < cartRS.data.products.length; i++) {
                checkedArr.push(false);
              }
              this.setState({
                cart: { ...cartRS.data },
                checkedArr: [...checkedArr],
              });
              this.props.dispatchGetCart(cartRS.data.products.length);
              this.props.dispatchLoaded();
            }
          });
        }
      });
    } else {
      window.location.href = "/";
    }
  };
  placeOrder = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/order/create/" + Config.ROLE.CLIENT + "/deli";
      this.props.dispatchAuthen(path, "PUT", (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          // placeDeliOrder(this.state.cart.products, (rs) => {
          //   if (rs.EC !== 0) {
          //     toast.error(rs.EM);
          //   } else {
          //     console.log(rs.data);
          //     this.props.dispatchLoaded();
          //   }
          // });
          let idsArr = [];
          for (let i = 0; i < this.state.cart.products.length; i++) {
            if (this.state.checkedArr[i]) {
              idsArr.push(this.state.cart.products[i]._id);
            }
          }
          let ids = String(idsArr[0]);
          let count = 1;
          while (count < idsArr.length) {
            ids += "." + String(idsArr[count]);
            count++;
          }
          window.location.href = "/checkout/" + ids;
        }
      });
    }
  };
  onAddQuantity = (index) => {
    let { cart, checkedArr, total } = this.state;
    cart.products[index].order_quantity++;
    total = this.recalculateTotal(cart, checkedArr);
    this.setState({
      cart: { ...cart },
      total: total,
    });
  };
  onMinusQuantity = (index) => {
    let { cart, total, checkedArr } = this.state;
    cart.products[index].order_quantity--;
    total = this.recalculateTotal(cart, checkedArr);
    this.setState({
      cart: { ...cart },
      total: total,
    });
  };
  onChangeQuantity = (index, value) => {
    let { cart, total, checkedArr } = this.state;
    cart.products[index].order_quantity = parseInt(value);
    total = this.recalculateTotal(cart, checkedArr);
    this.setState({
      cart: { ...cart },
      total: total,
    });
  };
  recalculateTotal = (cart, checkedArr) => {
    let total = 0;
    for (let i = 0; i < cart.products.length; i++) {
      if (checkedArr[i]) {
        total +=
          cart.products[i].product.price * cart.products[i].order_quantity;
      }
    }
    return total;
  };
  onCheck = (e, index, quantity) => {
    let { checkedArr, total, cart } = this.state;
    checkedArr[index] = e.target.checked;
    cart.products[index].order_quantity = quantity;
    total = this.recalculateTotal(cart, checkedArr);
    this.setState({
      total: total,
      checkedArr: [...checkedArr],
      cart: { ...cart },
    });
  };
  onCheckAll = (e) => {
    let { cart, checkedArr, total } = this.state;
    total = 0; // reset total after summary
    if (e.target.checked) {
      for (let i = 0; i < checkedArr.length; i++) {
        checkedArr[i] = true;
      }
    } else {
      for (let i = 0; i < checkedArr.length; i++) {
        checkedArr[i] = false;
      }
    }
    total = this.recalculateTotal(cart, checkedArr);
    this.setState({
      cart: { ...cart },
      checkedArr: [...checkedArr],
      total: total,
      checkAll: e.target.checked,
    });
  };
  removeProduct = (order_product_id) => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/rmv-cart/CLIENT";
      this.props.dispatchAuthen(path, "POST", (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          removeFromCart(order_product_id, (result) => {
            if (result.EC !== 0) {
              toast.error(result.EM);
            } else {
              toast.success("Xóa sản phẩm thành công");
              this.getCartForUser();
            }
          });
        }
      });
    }
  };
  render() {
    if (!this.state.cart.products)
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    else
      return (
        <Box
          maxWidth="xl"
          minWidth="1325px"
          className="home-container"
          // pt="200px"
        >
          <Header />
          <Box className="home-box0">
            <ToastContainer />
            <Box mt={3}>
              <RowHeader />
              {this.state.cart.products.map((orderProduct, index) => {
                return (
                  <RowData
                    orderProduct={orderProduct}
                    key={index}
                    index={index}
                    checked={this.state.checkedArr[index]}
                    onCheck={this.onCheck}
                    onMinusQuantity={this.onMinusQuantity}
                    onAddQuantity={this.onAddQuantity}
                    onChangeQuantity={this.onChangeQuantity}
                    removeProduct={this.removeProduct}
                  />
                );
              })}
              <TotalBar
                onChange={this.onCheckAll}
                total={this.state.total}
                checkAll={this.state.checkAll}
                placeOrder={this.placeOrder}
              />
            </Box>
          </Box>
        </Box>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.user.logged,
    loading: state.general.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLoading: () => {
      dispatch(GeneralAction.loading());
    },
    dispatchLoaded: () => {
      dispatch(GeneralAction.loaded());
    },
    dispatchAuthen: (path, method, done) => {
      dispatch(UserAction.authen(path, method, done));
    },
    dispatchGetCart: (cartNum) => {
      dispatch(UserAction.getCart(cartNum));
    },
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
