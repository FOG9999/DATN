import { Box } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import Loading from "../../components/general/Loading";
import { getCheckoutOrder } from "../../apis/order-pool/OrderPool";
import { UserAction } from "../../redux/actions/UserAction";
import { Config } from "../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import CheckoutRowHeader from "./CheckoutRowHeader";
import CheckoutRowData from "./CheckoutRowData";
import Header from "../../components/header/Container";
import CheckoutTotalBar from "./CheckoutTotalBar";

class CheckoutContainer extends Component {
  state = {
    products: [],
    shipFeeArr: [],
    total: 0,
  };
  componentDidMount() {
    this.getCheckout();
  }
  getCheckout = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/checkout/" + Config.ROLE.CLIENT;
      this.props.dispatchAuthen(path, "POST", (rs) => {
        if (rs.EC !== 0) {
          toast.error(rs.EM);
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          getCheckoutOrder(this.props.match.params.ids.split("."), (cartRS) => {
            if (cartRS.EC !== 0) {
              toast.error(cartRS.EM);
              this.props.dispatchLoaded();
            } else {
              let shipFees = [];
              for (let i = 0; i < cartRS.data.products.length; i++) {
                shipFees.push(Math.round(Math.random() * 5000) + 15000);
              }
              this.setState({
                products: [...cartRS.data.products],
                total: this.recalculateTotal(shipFees, cartRS.data.products),
                shipFeeArr: [...shipFees],
              });
            }
          });
          this.props.dispatchLoaded();
        }
      });
    } else {
      window.location.href = "/";
    }
  };
  placeOrder = () => {
    // this.props.dispatchLoading();
    // if (this.props.logged) {
    //   const path = "/order/create/" + Config.ROLE.CLIENT + "/deli";
    //   this.props.dispatchAuthen(path, "PUT", (rs) => {
    //     if (rs.EC !== 0) {
    //       toast.error(rs.EM);
    //       setTimeout(() => {
    //         window.location.href = "/";
    //       }, 3000);
    //     } else {
    //       placeDeliOrder(this.state.cart.products, (rs) => {
    //         if (rs.EC !== 0) {
    //           toast.error(rs.EM);
    //         } else {
    //           console.log(rs.data);
    //           this.props.dispatchLoaded();
    //         }
    //       });
    //     }
    //   });
    // }
  };
  recalculateTotal = (shipFees, products) => {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += products[i].product.price * products[i].order_quantity;
    }
    shipFees.forEach((shipfee) => (total += shipfee));
    return total;
  };
  render() {
    if (this.state.products.length <= 0)
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
              <CheckoutRowHeader />
              {this.state.products.map((orderProduct, index) => {
                return (
                  <CheckoutRowData
                    orderProduct={orderProduct}
                    key={index}
                    index={index}
                    shipFee={this.state.shipFeeArr[index]}
                  />
                );
              })}
              <CheckoutTotalBar
                total={this.state.total}
                // placeOrder={this.placeOrder}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);