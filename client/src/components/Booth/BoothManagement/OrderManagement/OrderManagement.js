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
import { toast } from "react-toastify";

const strings = {
  allOrderTitle: "Tất cả đơn hàng",
  waitingOrderTitle: "Chờ xác nhận",
  deliveryingOrderTitle: "Đang giao",
  receivedOrderTitle: "Đã giao",
  returnOrderTitle: "Trả hàng",
};

const ords = orders().slice(0, 3);
const tabTitles = [
  { label: strings.allOrderTitle, key: "" },
  { label: strings.waitingOrderTitle, key: "W" },
  { label: strings.deliveryingOrderTitle, key: "D" },
  { label: strings.receivedOrderTitle, key: "R" },
  { label: strings.returnOrderTitle, key: "C" },
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
  };
  componentDidMount() {
    this.setState({
      displayOrders: [
        ...ords.slice(
          this.state.pagesize * (ords.length - 1),
          this.state.pagesize * ords.length
        ),
      ],
      numOfOrders: ords.length,
    });
  }
  onClickTab = (tabIndex) => {
    // reset lại date filter thành Toàn bộ khi chọn 1 Tab
    let ordes = orders().filter((order) =>
      order.status.includes(tabTitles[tabIndex].key)
    );
    this.setState({
      selectedTab: tabIndex,
      numOfOrders: ordes.length,
      dateFilterIndex: 3,
      page: 1,
      displayOrders: ordes.slice(
        this.state.page * this.state.pagesize,
        this.state.pagesize * (this.state.page + 1)
      ),
    });
  };
  onChangeSearch = (e) => {};
  onChangeFilterDate = (e) => {
    // chỉnh sửa lại khi có API
    let dateIndex = e.target.value;
    const { pagesize, selectedTab } = this.state;
    let ordesYear = orders().filter(
      (order) =>
        new Date(order.on_date).getFullYear() === new Date().getFullYear()
    ); // chỉ dùng khi bộ lọc date có giá trị khác Toàn bộ
    switch (dateIndex) {
      case 0: {
        let ordesDay = ordesYear.filter(
          // lọc cho ngày hôm nay
          (order) =>
            new Date(order.on_date).getMonth() === new Date().getMonth() &&
            new Date(order.on_date).getDate() === new Date().getDate()
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
            new Date(order.on_date).getTime() >=
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
            new Date(order.on_date).getTime() >=
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
        let ordesDay = orders();
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
    }
  };
  onClickNextPage = () => {
    // chỉnh sửa lại khi có API
    const { page, pagesize, numOfOrders, selectedTab } = this.state;
    let ordes = orders().filter((order) =>
      order.status.includes(tabTitles[selectedTab].key)
    ); // lọc cho tab đang chọn
    this.setState({
      numOfOrders: ordes.length,
      page: page + 1,
      displayOrders: ordes.slice(page * pagesize, pagesize * (page + 1)),
    });
  };
  onClickPreviousPage = () => {
    // chỉnh sửa lại khi có API
    const { page, pagesize, selectedTab } = this.state;
    let ordes = orders().filter((order) =>
      order.status.includes(tabTitles[selectedTab].key)
    );
    this.setState({
      numOfOrders: ordes.length,
      page: page - 1,
      displayOrders: ordes.slice((page - 1) * pagesize, pagesize * page),
    });
  };
  render() {
    return (
      <Box m="auto" minWidth="800px" my="30px" className="white-background">
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
            return <RowData order={order} key={index} />;
          })}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <Box mr={2}>Trang</Box>
          <Box display="flex">
            <IconButton
              onClick={this.onClickPreviousPage}
              disabled={this.state.page <= 0}
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

export default Ordermanagement;
