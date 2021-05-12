import { Box, Button, IconButton, TextField } from "@material-ui/core";
import {
  Add,
  ArrowBackIos,
  ArrowForwardIos,
  RotateLeft,
  Search,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import RowData from "./PrdUploadRowData";
import RowHeader from "./PrdUploadRowHeader";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { UserAction } from "../../../redux/actions/UserAction";
import { Config } from "../../../config/Config";
import { AdminPool } from "../../../apis/AdminPool";
import Loading from "../../general/Loading";
import ModalPrdUploadShow from "./ModalPrdUploadShow";

function PrdUploadInspect() {
  // state = {
  //   categories: [],
  //   firsttime: true,
  //   selectedType: "",
  //   selectedCate: "",
  //   selectedTab: 0,
  //   page: 1,
  //   searchTitle: "",
  //   pagesize: 10,
  //   numOfProducts: 0,
  //   products: [],
  //   onSearching: false,
  // };
  const [firsttime, setFirsttime] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const pagesize = 10;
  const [length, setLength] = useState(0);
  const [products, setProducts] = useState([]);
  const [onSearching, setOnSearching] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductInd, setSelectedProductInd] = useState(0);

  const loading = useSelector((state) => state.general.loading);
  const logged = useSelector((state) => state.user.logged);
  const dispatch = useDispatch();

  function onChangeSearchTitle(e) {
    this.setState({
      searchTitle: e.target.value,
    });
  }
  function onCloseModal() {
    setShowModal(false);
  }
  function onOpenModal(index) {
    setSelectedProductInd(index);
    setShowModal(true);
  }
  function onClickSearch() {
    setPage(1);
    setTimeout(() => this.onSearch(), 500);
  }
  function resetSearch() {
    this.setState({
      selectedType: "",
      selectedCate: "",
      categories: [],
      searchTitle: "",
      onSearching: false,
      page: 1,
    });
    this.getProducts((rs) => {
      this.setState({
        products: [...rs.data.products],
        numOfProducts: rs.data.numOfProducts,
      });
      this.props.dispatchLoaded();
    });
  }
  function onClickPreviousPage() {
    setPage(page - 1);
  }
  function onClickNextPage() {
    setPage(page + 1);
    // reloadData();
  }
  function getProducts(done) {
    dispatch(GeneralAction.loading());
    if (logged) {
      const path = "/prd/get-list/" + Config.ROLE.SYSTEM.admin;
      dispatch(
        UserAction.authen(path, "GET", (auth) => {
          if (auth.EC !== 0) {
            dispatch(GeneralAction.loaded());
            toast.error(auth.EM);
          } else {
            AdminPool.getAllProducts(page, pagesize, (rs) => {
              if (rs.EC !== 0) {
                dispatch(GeneralAction.loaded());
                toast.error(rs.EM);
              } else {
                done(rs);
              }
            });
          }
        })
      );
    }
  }

  useEffect(() => {
    getProducts((rs) => {
      setProducts(rs.data.products);
      setLength(rs.data.length);
      setIsLastPage(rs.data.isLastPage);
      setFirsttime(false);
      dispatch(GeneralAction.loaded());
    });
  }, []);
  useEffect(() => {
    getProducts((rs) => {
      setProducts(rs.data.products);
      setLength(rs.data.length);
      setIsLastPage(rs.data.isLastPage);
      setFirsttime(false);
      dispatch(GeneralAction.loaded());
    });
  }, [page]);
  function reloadData() {
    getProducts((rs) => {
      setProducts(rs.data.products);
      setLength(rs.data.length);
      setIsLastPage(rs.data.isLastPage);
      setFirsttime(false);
      dispatch(GeneralAction.loaded());
    });
  }
  function updatePrdStatus(status) {
    onCloseModal();
    dispatch(GeneralAction.loading());
    dispatch(
      UserAction.authen(
        "/booth/update-status/" + status + "/" + Config.ROLE.SYSTEM.admin,
        "POST",
        (auth) => {
          if (auth.EC !== 0) {
            dispatch(GeneralAction.loaded());
            toast.error(auth.EM);
          } else {
            AdminPool.updatePrdStatus(
              status,
              products[selectedProductInd]._id,
              (rs) => {
                if (rs.EC !== 0) {
                  dispatch(GeneralAction.loaded());
                  toast.error(auth.EM);
                } else {
                  reloadData();
                }
              }
            );
          }
        }
      )
    );
  }
  if (loading || firsttime) {
    return (
      <Box>
        <ToastContainer />
        <Loading />
      </Box>
    );
  } else
    return (
      <Box m="auto" minWidth="800px" my="30px" className="white-background">
        <Box px={3}>
          <Box display="flex">
            <Box display="flex" flexGrow="1" alignItems="center">
              <Box display="flex" py={2} alignItems="center" pr={2}>
                Tên gian hàng
              </Box>
              <TextField
                value={searchTitle}
                onChange={onChangeSearchTitle}
                placeholder="Tên người dùng"
                fullWidth={true}
              />
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" alignItems="center" pr={1} py={1}>
              <Button
                className="backgroundcolor-orange color-white"
                onClick={onClickSearch}
              >
                <Search />
                Tìm
              </Button>
            </Box>
            <Box display="flex" alignItems="center" p={1}>
              <Button
                onClick={resetSearch}
                className="backgroundcolor-orange color-white"
              >
                <RotateLeft />
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
        <ModalPrdUploadShow
          show={showModal}
          onClose={onCloseModal}
          product={products[selectedProductInd]}
          update={updatePrdStatus}
        />
        <Box display="flex" px={3}>
          <Box flexGrow="1" display="flex" alignItems="center">
            <h2>{length} sản phẩm</h2>
          </Box>
          {/* <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              className="backgroundcolor-orange color-white"
              onClick={onOpenModal}
            >
              <Add />
              Thêm tài khoản mới
            </Button>
          </Box> */}
        </Box>
        <Box px={3}>
          <RowHeader />
        </Box>
        <Box px={3}>
          {products.map((product, index) => {
            return (
              <RowData
                product={product}
                onOpenModal={onOpenModal}
                index={index}
                key={index}
              />
            );
          })}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <Box mr={2}>Trang</Box>
          <Box display="flex">
            <IconButton onClick={onClickPreviousPage} disabled={page === 1}>
              <ArrowBackIos />
            </IconButton>
            <Box px={3} display="flex" alignItems="center">
              {page}
            </Box>
            <IconButton onClick={onClickNextPage} disabled={isLastPage}>
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
}

export default PrdUploadInspect;
