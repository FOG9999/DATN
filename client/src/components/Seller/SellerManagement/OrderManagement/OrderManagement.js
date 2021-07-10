import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos, Search } from "@material-ui/icons";
import React, { Component } from "react";
import { orders } from "../../../../others/test/Orders";
import RowData from "./RowData";
import RowHeader from "./RowHeader";
import { toast, ToastContainer } from "react-toastify";
import { UserAction } from "../../../../redux/actions/UserAction";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { connect } from "react-redux";
import { getUserOrders } from "../../../../apis/user-pool/UserPool";
import Loading from "../../../general/Loading";
import { startDeliver } from "../../../../apis/order-pool/OrderPool";

const strings = {
  allOrderTitle: "Tất cả đơn hàng",
  waitingOrderTitle: "Chờ xác nhận",
  deliveryingOrderTitle: "Đang giao",
  receivedOrderTitle: "Đã giao",
  returnOrderTitle: "Trả hàng",
  cancelOrderTitle: "Đã hủy đơn",
};

const tabTitles = [
  { label: strings.allOrderTitle, key: "" },
  { label: strings.waitingOrderTitle, key: "0" },
  { label: strings.deliveryingOrderTitle, key: "1" },
  { label: strings.receivedOrderTitle, key: "2" },
  { label: strings.returnOrderTitle, key: "3" },
  { label: strings.cancelOrderTitle, key: "-1" },
];

const dateFilters = ["Hôm nay", "7 ngày trước", "30 ngày trước", "Toàn bộ"];

class Ordermanagement extends Component {
  state = {
    selectedTab: 0,
    searchKeyword: "",
    dateFilterIndex: 3,
    page: 1,
    displayOrders: [],
    pagesize: 5,
    numOfOrders: 0,
    nomore: false,
  };
  componentDidMount() {
    this.getOrders(() => {
      this.setState({
        displayOrders: [
          ...this.state.displayOrders.slice(
            (this.state.page - 1) * this.state.pagesize,
            this.state.page * this.state.pagesize
          ),
        ],
      });
      this.props.dispatchLoaded();
    });
  }
  getOrders = (done) => {
    // lấy danh sách order
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/user-get/CLIENT";
      this.props.dispatchAuthen(path, "GET", (auth) => {
        if (auth.EC !== 0) {
          toast.error(auth.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
        } else {
          getUserOrders(this.state.pagesize, this.state.page, (rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM.toString());
            } else {
              this.setState({
                displayOrders: [...rs.data.orders],
                numOfOrders: rs.data.numOfOrds,
              });
              done();
            }
          });
        }
      });
    } else {
      toast.error("Người dùng chưa đăng nhập. Đăng xuất trong 3s...");
    }
  };
  onClickTab = (tabIndex) => {
    this.getOrders(() => {
      let ordes = this.state.displayOrders.filter((order) =>
        order.status.includes(tabTitles[tabIndex].key)
      );
      this.setState({
        selectedTab: tabIndex,
        dateFilterIndex: 3,
        page: 1,
        numOfOrders: ordes.length,
        displayOrders: ordes.slice(
          (this.state.page - 1) * this.state.pagesize,
          this.state.pagesize * this.state.page
        ),
      });
      this.props.dispatchLoaded();
    });
  };
  onChangeSearch = (e) => {};
  startDeliverOrders = (ordIDs) => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/deliver-ord/CLIENT";
      this.props.dispatchAuthen(path, "PUT", (auth) => {
        if (auth.EC !== 0) {
          toast.error(auth.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
        } else {
          startDeliver(ordIDs).then((rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
              this.props.dispatchLoaded();
            } else {
              toast.success("Giao hàng thành công!");
              this.getOrders(() => {
                this.setState({
                  displayOrders: [
                    ...this.state.displayOrders.slice(
                      (this.state.page - 1) * this.state.pagesize,
                      this.state.page * this.state.pagesize
                    ),
                  ],
                });
                this.props.dispatchLoaded();
              });
            }
          });
        }
      });
    }
  };
  onChangeFilterDate = (e) => {
    // chỉnh sửa lại khi có API
    let dateIndex = e.target.value;
    const { pagesize, selectedTab } = this.state;
    this.getOrders(() => {
      let ordesYear = this.state.displayOrders.filter(
        (order) =>
          new Date(order.createdAt).getFullYear() === new Date().getFullYear()
      ); // chỉ dùng khi bộ lọc date có giá trị khác Toàn bộ
      switch (dateIndex) {
        case 0: {
          let ordesDay = ordesYear.filter(
            // lọc cho ngày hôm nay
            (order) =>
              new Date(order.createdAt).getMonth() === new Date().getMonth() &&
              new Date(order.createdAt).getDate() === new Date().getDate()
          );
          this.setState({
            dateFilterIndex: dateIndex,
            displayOrders: ordesDay
              .filter(
                (order) => order.status.includes(tabTitles[selectedTab].key) // lọc cho tab hiện tại
              )
              .slice(0, pagesize),
            page: 1,
          });
          break;
        }
        case 1: {
          let ordesDay = ordesYear.filter(
            // lọc cho tuần này
            (order) =>
              new Date(order.createdAt).getTime() >=
              new Date().getTime() - 7 * 3600000 * 24
          );
          this.setState({
            dateFilterIndex: dateIndex,
            displayOrders: ordesDay
              .filter(
                (order) => order.status.includes(tabTitles[selectedTab].key) // lọc cho tab hiện tại
              )
              .slice(0, pagesize),
            page: 1,
          });
          break;
        }
        case 2: {
          let ordesDay = ordesYear.filter(
            // lọc cho tháng này
            (order) =>
              new Date(order.createdAt).getTime() >=
              new Date().getTime() - 30 * 3600000 * 24
          );
          this.setState({
            dateFilterIndex: dateIndex,
            displayOrders: ordesDay
              .filter(
                (order) => order.status.includes(tabTitles[selectedTab].key) // lọc cho tab hiện tại
              )
              .slice(0, pagesize),
            page: 1,
          });
          break;
        }
        default: {
          // let ordesDay = orders();
          // this.setState({
          //   dateFilterIndex: dateIndex,
          //   displayOrders: ordesDay
          //     .filter(
          //       (order) => order.status.includes(tabTitles[selectedTab].key) // lọc cho tab hiện tại
          //     )
          //     .slice(0, pagesize),
          //   page: 1,
          // });

          const { page, pagesize, selectedTab } = this.state;
          this.getOrders(() => {
            let ordes = this.state.displayOrders.filter((order) =>
              order.status.includes(tabTitles[selectedTab].key)
            ); // lọc cho tab đang chọn
            this.setState({
              numOfOrders: ordes.length,
              page: 1,
              displayOrders: [
                ...ordes.slice((page - 1) * pagesize, pagesize * page),
              ],
              dateFilterIndex: dateIndex,
            });
            this.props.dispatchLoaded();
          });
          break;
        }
      }
      this.setState({
        numOfOrders: this.state.displayOrders.length,
      });
      this.props.dispatchLoaded();
    });
  };
  onClickNextPage = () => {
    // chỉnh sửa lại khi có API
    const { page, pagesize, selectedTab } = this.state;
    this.getOrders(() => {
      let ordes = this.state.displayOrders.filter((order) =>
        order.status.includes(tabTitles[selectedTab].key)
      ); // lọc cho tab đang chọn
      if (ordes.slice(page * pagesize, pagesize * (page + 1)).length === 0) {
        this.props.dispatchLoaded();
        toast.warn("Không còn đơn hàng nào khác");
      } else {
        this.setState({
          numOfOrders: ordes.length,
          page: page + 1,
          displayOrders: [
            ...ordes.slice(page * pagesize, pagesize * (page + 1)),
          ],
        });
        this.props.dispatchLoaded();
      }
    });
  };
  onClickPreviousPage = () => {
    // chỉnh sửa lại khi có API
    const { page, pagesize, selectedTab } = this.state;
    this.getOrders(() => {
      let ordes = this.state.displayOrders.filter((order) =>
        order.status.includes(tabTitles[selectedTab].key)
      ); // lọc cho tab đang chọn
      this.setState({
        numOfOrders: ordes.length,
        page: page - 1,
        displayOrders: [...ordes.slice((page - 1) * pagesize, pagesize * page)],
      });
      this.props.dispatchLoaded();
    });
  };
  render() {
    if (this.props.loading) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <Box m="auto" minWidth="800px" my="30px" className="white-background">
          {/* <ToastContainer /> */}
          <Box display="flex" borderBottom="1px solid #e8e8e8">
            {tabTitles.map((tab, index) => {
              return (
                <Box
                  py={2}
                  px={3}
                  key={index}
                  style={
                    this.state.selectedTab === index
                      ? { color: "rgb(238, 77, 46)" }
                      : null
                  }
                  onClick={() => this.onClickTab(index)}
                  className="cursor-pointer"
                >
                  <b>{tab.label}</b>
                </Box>
              );
            })}
          </Box>
          <Box px={3}>
            <Box display="flex">
              <Box display="flex" flexGrow="1" alignItems="center">
                <TextField
                  size="small"
                  value={this.state.searchKeyword}
                  onChange={this.onChangeSearch}
                  placeholder="Tìm kiếm"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className="float-right" display="flex">
                <Box px={2} display="flex" alignItems="center">
                  Ngày đặt hàng
                </Box>
                <Box p={1}>
                  <Select
                    value={this.state.dateFilterIndex}
                    onChange={this.onChangeFilterDate}
                  >
                    {dateFilters.map((date, index) => {
                      return (
                        <MenuItem value={index} key={index}>
                          <Box px={1}>{date}</Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
                <Box p={1}>
                  <Button>Xuất</Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" px={3}>
            <Box flexGrow="1" display="flex" alignItems="center">
              <h2>{this.state.numOfOrders} đơn hàng</h2>
            </Box>
            {this.state.selectedTab === 1 ? (
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  className="backgroundcolor-orange color-white"
                >
                  Giao hàng hàng loạt
                </Button>
              </Box>
            ) : null}
          </Box>
          <Box px={3}>
            <RowHeader />
          </Box>
          <Box px={3} pb={3}>
            {this.state.displayOrders.map((order, index) => {
              return (
                <RowData
                  startDeliver={this.startDeliverOrders}
                  order={order}
                  key={index}
                />
              );
            })}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={2}
          >
            <Box mr={2}>Trang</Box>
            <Box display="flex">
              <IconButton
                onClick={this.onClickPreviousPage}
                disabled={this.state.page <= 1}
              >
                <ArrowBackIos />
              </IconButton>
              <Box px={3} display="flex" alignItems="center">
                {this.state.page}
              </Box>
              <IconButton onClick={this.onClickNextPage}>
                <ArrowForwardIos />
              </IconButton>
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
    dispatchLogout: (done) => {
      dispatch(UserAction.logout(done));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ordermanagement);
