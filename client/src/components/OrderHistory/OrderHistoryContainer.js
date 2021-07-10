import { Box } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { cancelOrder, getInvoices } from "../../apis/order-pool/OrderPool";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import { UserAction } from "../../redux/actions/UserAction";
import Loading from "../general/Loading";
import HeaderContainer from "../header/Container";
import OrderHistoryRowData from "./OrderHistoryRowData";
import OrderHistoryRowHeader from "./OrderHsitoryRowHeader";

class OrderHistoryContainer extends Component {
  constructor(props) {
    super(props);
    document.title = "Lịch sử mua hàng";
  }
  state = {
    invoices: [],
    orders: [],
    loadcomplete: false,
  };
  componentDidMount() {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/my-invoices/CLIENT";
      this.props.dispatchAuthen(path, "GET", (authRS) => {
        if (authRS.EC !== 0) {
          toast.error(authRS.EM);
          this.props.dispatchLoaded();
        } else {
          getInvoices().then((rs) => {
            this.setState({
              invoices: [...rs.data.invoices],
              orders: [...rs.data.ordersForInvoices],
              loadcomplete: true,
            });
            this.props.dispatchLoaded();
          });
        }
      });
    }
  }
  cancelOrder = (ordID) => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/cancel/CLIENT/" + ordID;
      this.props.dispatchAuthen(path, "DELETE", (authRS) => {
        if (authRS.EC !== 0) {
          toast.error(authRS.EM);
          this.props.dispatchLoaded();
        } else {
          cancelOrder(ordID).then((canceled) => {
            if (canceled.EC !== 0) {
              toast.error(canceled.EM);
              this.props.dispatchLoaded();
            } else {
              const path = "/my-invoices/CLIENT";
              this.props.dispatchAuthen(path, "GET", (authRS) => {
                if (authRS.EC !== 0) {
                  toast.error(authRS.EM);
                  this.props.dispatchLoaded();
                } else {
                  getInvoices().then((rs) => {
                    this.setState({
                      invoices: [...rs.data.invoices],
                      orders: [...rs.data.ordersForInvoices],
                      loadcomplete: true,
                    });
                    this.props.dispatchLoaded();
                  });
                }
              });
            }
          });
        }
      });
    }
  };
  render() {
    if (this.props.loading || !this.state.loadcomplete) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <Box maxWidth="xl" minWidth="1325px" className="home-container">
          <ToastContainer />
          <HeaderContainer />
          <Box py={1} pl={2} borderBottom="1px solid #e8e8e8">
            <big>
              <b className="color-orange">Lịch sử mua hàng</b>
            </big>
          </Box>
          {this.state.invoices.length > 0 ? (
            <Box className="home-box0">
              {this.state.invoices.map((invoice, index) => {
                return (
                  <Box key={index} my={1}>
                    <Box
                      display="flex"
                      className="backgroundcolor-aaa"
                      borderBottom="1px solid #e8e8e8"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        pl={2}
                        py={1}
                        flexGrow={1}
                      >
                        <b>Hóa đơn số</b>
                      </Box>
                      <Box display="flex" px={2} alignItems="center">
                        <b>{invoice._id}</b>
                      </Box>
                    </Box>
                    <Box>
                      <OrderHistoryRowHeader />
                      {this.state.orders[index].map((ord, ind) => {
                        return (
                          <OrderHistoryRowData
                            orderProduct={ord}
                            order={invoice.orders[ind]}
                            key={ind}
                            index={ind}
                            shipFee={invoice.ship_fees[ind]}
                            cancelOrder={this.cancelOrder}
                          />
                        );
                      })}
                    </Box>
                    <Box display="flex" p={1} className="backgroundcolor-aaa">
                      <Box flexGrow="1" pl={2}>
                        Tổng tiền:
                      </Box>
                      <Box>
                        <b>
                          {turnNumberToNumberWithSeperator(invoice.total)} VND
                        </b>
                      </Box>
                    </Box>
                    <Box display="flex" p={1} className="backgroundcolor-aaa">
                      <Box flexGrow="1" pl={2}>
                        Phương thức thanh toán:
                      </Box>
                      <Box>
                        <b>{invoice.payment_method}</b>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight="350px"
            >
              <h1>Không có đơn hàng nào được đặt</h1>
            </Box>
          )}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryContainer);
