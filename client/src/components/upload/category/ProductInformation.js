import {
  Box,
  Button,
  FormControl,
  RadioGroup,
  Select,
  FormControlLabel,
  Radio,
  MenuItem,
  InputAdornment,
  TextField,
  Divider,
} from "@material-ui/core";
import React, { Component } from "react";
import { CloudUpload } from "@material-ui/icons";
import RichTextEditor from "../description/RichTextEditor";
import RTE from "react-rte";
import cNd from "../../../others/convincesAndDistricts.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  turnNumberWithSeperatorIntoNumber,
  turnNumberToNumberWithSeperator,
} from "../../../others/functions/checkTextForNumberInput";
import PreviewImage from "../image_upload/PreviewImage";
import MainImgModal from "../image_upload/MainImgModal";
import { connect } from "react-redux";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { UserAction } from "../../../redux/actions/UserAction";
import { createProduct } from "../../../apis/item-pool/ItemPool";
import { uploadImageFile } from "../../../apis/other-pool/OtherPool";
import { Config } from "../../../config/Config";

const itemCategories = [
  "Quần áo",
  "Đồ trang điểm",
  "Giày dép",
  "Vật dụng",
  "Trang trí",
  "Khác",
];
const foodCategories = [
  "Rau củ quả",
  "Hoa quả tươi",
  "Sản phẩm thịt",
  "Bánh kẹo và snack",
];
const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));
const units = ["KG", "Quả", "Con", "Hộp", "Vỉ", "Gói"];
const statusArr = ["Đang vận chuyển", "Hàng mói về", "Hàng xả kho"];
const maxImageLimit = 12;
const strings = {
  requiredProTitle: "Tên sản phẩm không được để trống",
  requiredProStatus: "Trạng thái sản phẩm còn thiếu",
  requiredProPrice: "Giá tiền còn thiếu",
  requiredProContent: "Vui lòng cung cấp thông tin chi tiết cho sản phẩm",
  tooLongProTitle: "Tên sản phẩm quá dài",
  minLengthProContent: 100,
  maxLengthTitle: 80,
  moreDetail: "Vui lòng cung cấp thêm thông tin cho sản phẩm",
  requiredProQuantity: "Điền số lượng sản phẩm",
  enterNumber: "Vui lòng nhập giá trị số cho trường này",
  tooManyImages: `Số lượng ảnh đăng tối đa là ${maxImageLimit}`,
  maxImageLimit: maxImageLimit,
  fileTooLarge: "File ảnh quá lớn",
  requiredProAddressDetail: "Nhập địa chỉ chi tiết",
};

const productItem = {
  title: "",
  category: itemCategories[0],
  quantity: "",
  location: {
    street: convincesAndDistricts[1].districts[0].streets[0].name,
    district: convincesAndDistricts[1].districts[0].name,
    convince: convincesAndDistricts[1].name,
  },
  status: "",
  brand: "",
  price: "",
  images: [],
  content: {
    value: RTE.createEmptyValue(),
    htmlStr: RTE.createEmptyValue().toString("html"),
  },
  addressDetail: "",
};

const productFood = {
  title: "",
  category: foodCategories[0],
  location: {
    street: convincesAndDistricts[1].districts[0].streets[0].name,
    district: convincesAndDistricts[1].districts[0].name,
    convince: convincesAndDistricts[1].name,
  },
  unit: "KG",
  fromDate: "Hôm nay",
  images: [],
  quantity: "",
  content: {
    value: RTE.createEmptyValue(),
    htmlStr: RTE.createEmptyValue().toString("html"),
  },
  price: "",
  status: "",
  addressDetail: "",
};

class ProductCategory extends Component {
  state = {
    product: { ...productItem },
    selectedCate: [...itemCategories],
    proCategory: "Vật phẩm",
    uploadImages: {
      filereaders: [],
      imageSrcs: [],
      imageNames: [],
      imageFiles: [],
      types: [],
    },
    showView: false,
    selectedImageIndex: -1,
    checkFields: [
      { name: "title", error: false },
      { name: "status", error: false },
      { name: "price", error: false },
      { name: "content", error: false },
      { name: "quantity", error: false },
      { name: "addressDetail", error: false },
    ],
  };
  componentDidMount() {
    let filereaders = [];
    for (let i = 0; i < strings.maxImageLimit; i++) {
      let filereader = new FileReader();
      filereaders.push(filereader);
    }
    this.setState({
      uploadImages: {
        ...this.state.uploadImages,
        filereaders: [...filereaders],
      },
    });
  }
  checkValid = (fieldName) => {
    let value = this.state.product[fieldName];
    let msg = "";
    switch (fieldName) {
      case "title": {
        if (!value) {
          msg = strings.requiredProTitle;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "title") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        } else if (value.length > strings.maxLengthTitle) {
          msg = strings.tooLongProTitle;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "title") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      case "addressDetail": {
        if (!value) {
          msg = strings.requiredProAddressDetail;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "addressDetail") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      case "quantity": {
        if (this.state.proCategory === "Vật phẩm") {
          if (!value) {
            msg = strings.requiredProQuantity;
            let oldCheckFields = this.state.checkFields;
            oldCheckFields.forEach((field) => {
              if (field.name !== "quantity") {
                field.error = false;
              } else field.error = true;
            });
            this.setState({
              checkFields: [...oldCheckFields],
            });
          }
        }
        break;
      }
      case "status": {
        if (!value) {
          msg = strings.requiredProStatus;
          this.setInputError("status");
        }
        break;
      }
      case "price": {
        if (!value) {
          msg = strings.requiredProPrice;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "price") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      case "content": {
        if (!value) {
          msg = strings.requiredProContent;
        } else if (value.length < strings.minLengthProContent) {
          msg = strings.moreDetail;
        }
        break;
      }

      default:
        break;
    }

    if (msg && fieldName !== "status" && fieldName !== "content")
      document.getElementById(`id${fieldName}`).focus();
    return msg;
  };
  deleteImage = (index) => {
    const { imageSrcs, imageNames, imageFiles, types } =
      this.state.uploadImages;
    imageSrcs.splice(index, 1);
    imageFiles.splice(index, 1);
    imageNames.splice(index, 1);
    types.splice(index, 1);
    this.setState({
      uploadImages: {
        ...this.state.uploadImages,
        imageSrcs: [...imageSrcs],
        imageFiles: [...imageFiles],
        imageNames: [...imageNames],
        types: [...types],
      },
    });
  };
  submitProduct = () => {
    let msg = "";
    for (let i = 0; i < this.state.checkFields.length; i++) {
      msg = this.checkValid(this.state.checkFields[i].name);
      if (!!msg) break;
    }
    if (!!msg) {
      toast.error(msg, undefined);
    } else {
      this.props.dispatchLoading();
      if (this.props.logged) {
        const type = this.state.proCategory === "Vật phẩm" ? "I" : "F";
        const path = "/create/CLIENT/" + type;
        this.props.dispatchAuthen(path, "POST", (auth) => {
          if (auth.EC !== 0) {
            toast.error(auth.EM);
            this.props.dispatchLogout(() => {
              this.props.dispatchLoaded();
              window.location.href = "/";
            });
          } else {
            const statePro = { ...this.state.product };
            let transformedImageNames = this.state.uploadImages.imageNames.map(
              (name, ind) => `${Config.UploadServer}/public/img/${name}`
            );
            let uploadProduct = {};
            uploadProduct.title = statePro.title;
            uploadProduct.category = statePro.category;
            uploadProduct.quantity = parseInt(statePro.quantity);
            uploadProduct.location = {
              detail: statePro.addressDetail,
              ...statePro.location,
            };
            uploadProduct.brand = statePro.brand;
            uploadProduct.price = statePro.price;
            uploadProduct.images = [...transformedImageNames];
            uploadProduct.description = statePro.content.htmlStr;
            if (this.state.proCategory === "Thực phẩm") {
              uploadProduct.unit = statePro.unit;
            }
            createProduct(uploadProduct, type, (rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
                this.props.dispatchLoaded();
              } else {
                uploadImageFile(
                  this.state.uploadImages.imageFiles,
                  (doneRS) => {
                    if (doneRS.EC !== 0) {
                      toast.error(doneRS.EM);
                      this.props.dispatchLoaded();
                    } else {
                      toast.success("Đăng tải sản phẩm thành công");
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
  };
  onChangeProductCategory = (e) => {
    if (e.target.checked) {
      switch (e.target.value) {
        case "Vật phẩm": {
          this.setState({
            selectedCate: [...itemCategories],
            proCategory: e.target.value,
            product: { ...productItem },
          });
          break;
        }
        case "Thực phẩm": {
          this.setState({
            selectedCate: [...foodCategories],
            proCategory: e.target.value,
            product: { ...productFood },
          });
          break;
        }
        default:
          break;
      }
    }
  };
  onChangeLocation = (e) => {
    let newLocation = { ...this.state.product.location };
    switch (e.target.name) {
      case "street": {
        newLocation.street = e.target.value;
        this.setState({
          product: {
            ...this.state.product,
            location: {
              ...newLocation,
            },
          },
        });
        break;
      }
      case "district": {
        newLocation.district = e.target.value;
        newLocation.street = convincesAndDistricts[1].districts
          .filter((dis) => dis.name === newLocation.district)[0]
          .streets.map((street, index) => {
            return street.name;
          })[0];
        // console.log(newLocation);
        this.setState({
          product: {
            ...this.state.product,
            location: {
              ...newLocation,
            },
          },
        });
        break;
      }
      default:
        break;
      // console.log(newLocation);
    }
  };
  onChangeEditorState = (value) => {
    this.setState({
      product: {
        ...this.state.product,
        content: {
          value: value,
          htmlStr: value.toString("html"),
        },
      },
    });
  };
  setInputError = (name) => {
    let oldCheckFields = this.state.checkFields;
    oldCheckFields.forEach((field) => {
      if (field.name === name) {
        field.error = true;
      } else {
        field.error = false;
      }
    });
  };
  onChangeImageUpload = (e) => {
    const { imageFiles, imageNames, imageSrcs, filereaders, types } =
      this.state.uploadImages;
    let files = [...e.target.files];
    if (files.length + imageSrcs.length > strings.maxImageLimit) {
      toast.error(strings.tooManyImages);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.size / 1000000 > 25) {
        toast.error(strings.fileTooLarge);
        return;
      }
      imageFiles.push(file);
      imageNames.push(file.name);
      filereaders[i].onloadend = () => {
        if (file.type.includes("image")) {
          let preview = new Image();
          preview.src = filereaders[i].result;
          // Sau khi filereader đã đọc xong và ảnh đã được load lên (preview.onload) thì ms push vào imageSrcs?
          // preview ở đây có vai trò lấy được naturalHeight và naturalWidth
          // preview.onload = () => {
          imageSrcs.push({
            src: filereaders[i].result,
            width: preview.naturalWidth,
            height: preview.naturalHeight,
          });
          // đánh dấu đây là 1 image
          types.push("I");
          // push xong cái cho hiển thị luôn
          this.setState({
            uploadImages: {
              filereaders: [...filereaders],
              imageSrcs: [...imageSrcs],
              imageNames: [...imageNames],
              imageFiles: [...imageFiles],
              types: [...types],
            },
          });
          // };
        } else if (file.type.includes("video")) {
          imageSrcs.push({
            src: filereaders[i].result,
            width: 800,
            height: 500,
          });
          // đánh dấu đây là 1 video
          types.push("V");
          // push xong cái cho hiển thị luôn
          this.setState({
            uploadImages: {
              filereaders: [...filereaders],
              imageSrcs: [...imageSrcs],
              imageNames: [...imageNames],
              imageFiles: [...imageFiles],
              types: [...types],
            },
          });
        }
      };
      filereaders[i].readAsDataURL(file);
    }
  };
  onClickPreviewImage = (index) => {
    this.setState({
      selectedImageIndex: index,
      showView: true,
    });
  };
  onChangeInputField = (e) => {
    // console.log(e.target);
    switch (e.target.type) {
      case "radio": {
        if (e.target.checked)
          this.setState({
            product: {
              ...this.state.product,
              [e.target.name]: e.target.value,
            },
          });
        break;
      }
      default:
        if (e.target.name === "price" || e.target.name === "quantity") {
          if (
            !!e.target.value &&
            /\D/i.test(turnNumberWithSeperatorIntoNumber(e.target.value))
          ) {
            toast.error(strings.enterNumber);
            this.setInputError(e.target.name);
            document.getElementById(`id${e.target.name}`).focus();
            break;
          } else {
            this.setState({
              checkFields: [
                ...this.state.checkFields.map((field) => {
                  return { name: field.name, error: false };
                }),
              ],
              product: {
                ...this.state.product,
                [e.target.name]: turnNumberWithSeperatorIntoNumber(
                  e.target.value.toString()
                ),
              },
            });
            break;
          }
        } else {
          // console.log("check");
          this.setState({
            product: {
              ...this.state.product,
              [e.target.name]: e.target.value,
            },
          });
          break;
        }
    }
  };
  closeView = () => {
    this.setState({
      showView: false,
    });
  };
  render() {
    return (
      <Box className="white-background" p={2}>
        <ToastContainer />
        {this.state.showView ? (
          <MainImgModal
            close={this.closeView}
            show={this.state.showView}
            main={{
              width:
                this.state.uploadImages.imageSrcs[this.state.selectedImageIndex]
                  .width,
              height:
                this.state.uploadImages.imageSrcs[this.state.selectedImageIndex]
                  .height,
              src: this.state.uploadImages.imageSrcs[
                this.state.selectedImageIndex
              ].src,
            }}
            type={this.state.uploadImages.types[this.state.selectedImageIndex]}
          />
        ) : null}
        <Box px={2}>
          <h1>Các thông tin chung</h1>
        </Box>
        <Divider />
        <Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Loại hàng hóa
            </Box>
            <Box>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  value={this.state.proCategory}
                  row
                  onChange={this.onChangeProductCategory}
                >
                  <FormControlLabel
                    value="Vật phẩm"
                    control={<Radio />}
                    label="Vật phẩm"
                    checked={this.state.proCategory === "Vật phẩm"}
                  />
                  <FormControlLabel
                    value="Thực phẩm"
                    control={<Radio />}
                    label="Thực phẩm"
                    checked={this.state.proCategory === "Thực phẩm"}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Tên sản phẩm
            </Box>
            <Box width="800px">
              <TextField
                onChange={this.onChangeInputField}
                size="small"
                name="title"
                value={this.state.product.title}
                variant="outlined"
                fullWidth={true}
                error={this.state.checkFields[0].error}
                id="idtitle"
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Chủng loại sản phẩm
            </Box>
            <Box>
              <FormControl>
                <Select
                  value={this.state.product.category}
                  onChange={this.onChangeInputField}
                  name="category"
                >
                  {this.state.selectedCate.map((cate, index) => {
                    return (
                      <MenuItem key={index} value={cate}>
                        <Box px={2}>{cate}</Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Địa chỉ
            </Box>
            <Box display="flex">
              <Box mr={2}>
                <Select
                  value={this.state.product.location.street}
                  name="street"
                  onChange={this.onChangeLocation}
                >
                  {convincesAndDistricts[1].districts
                    .filter(
                      (dis) => dis.name === this.state.product.location.district
                    )[0]
                    .streets.map((street, index) => {
                      return (
                        <MenuItem key={index} value={street.name}>
                          <Box px={2}>{street.name}</Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </Box>
              <Box mr={2}>
                <Select
                  value={this.state.product.location.district}
                  name="district"
                  onChange={this.onChangeLocation}
                >
                  {convincesAndDistricts[1].districts.map((district, index) => {
                    return (
                      <MenuItem key={index} value={district.name}>
                        <Box px={1}>{district.name}</Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
              <Box mr={2}>
                <Select
                  value={this.state.product.location.convince}
                  name="conivce"
                  onChange={this.onChangeLocation}
                >
                  {convincesAndDistricts.map((convince, index) => {
                    return (
                      <MenuItem key={index} value={convince.name}>
                        <Box px={1}>{convince.name}</Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Địa chỉ chi tiết
            </Box>
            <Box width="800px">
              <TextField
                onChange={this.onChangeInputField}
                size="small"
                name="addressDetail"
                value={this.state.product.addressDetail}
                variant="outlined"
                fullWidth={true}
                error={this.state.checkFields[5].error}
                id="idaddressDetail"
              />
            </Box>
          </Box>
          {this.state.proCategory === "Vật phẩm" ? (
            <Box>
              <Box display="flex" mt={2}>
                <Box width="300px" pl={2} py={1}>
                  Nhãn hiệu
                </Box>
                <Box width="400px">
                  <TextField
                    onChange={this.onChangeInputField}
                    name="brand"
                    value={this.state.product.brand}
                    variant="outlined"
                    size="small"
                    fullWidth={true}
                  />
                </Box>
              </Box>
            </Box>
          ) : null}
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Số lượng
            </Box>
            <Box width="400px">
              <TextField
                onChange={this.onChangeInputField}
                name="quantity"
                value={turnNumberToNumberWithSeperator(
                  this.state.product.quantity
                )}
                variant="outlined"
                fullWidth={true}
                size="small"
                id="idquantity"
                error={this.state.checkFields[4].error}
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Trạng thái sản phẩm
            </Box>
            <Box>
              {statusArr.map((st, index) => {
                return (
                  <Box p={1} key={index}>
                    <input
                      type="radio"
                      checked={this.state.product.status === st}
                      value={st}
                      key={index}
                      // id="idstatus"
                      onChange={this.onChangeInputField}
                      name="status"
                    />
                    &nbsp;{st}
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Giá thành
            </Box>
            <Box>
              <TextField
                error={this.state.checkFields[2].error}
                size="small"
                name="price"
                onChange={this.onChangeInputField}
                value={turnNumberToNumberWithSeperator(
                  this.state.product.price
                )}
                variant="outlined"
                id="idprice"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          {this.state.proCategory === "Vật phẩm" ? null : (
            <Box mt={2} display="flex">
              <Box width="300px" pl={2} py={1}>
                Đơn vị
              </Box>
              <RadioGroup
                row
                value={this.state.product.unit}
                onChange={this.onChangeInputField}
                name="unit"
              >
                {units.map((unit, index) => {
                  return (
                    <FormControlLabel
                      value={unit}
                      key={index}
                      control={<Radio />}
                      label={`/1 ${unit}`}
                      checked={this.state.product.unit === unit}
                    />
                  );
                })}
              </RadioGroup>
            </Box>
          )}
          <Box mt={2} display="flex">
            <Box width="300px" pl={2} pt={4}>
              Hình ảnh cho sản phẩm
            </Box>
            <Box minWidth="900px">
              <Box py={2}>
                <Box
                  borderColor="#aaa"
                  border="1px solid #aaa"
                  display="flex"
                  flexWrap="wrap"
                  minHeight="350px"
                  justifyContent="center"
                >
                  {this.state.uploadImages.imageSrcs.map((src, index) => {
                    return (
                      <PreviewImage
                        deleteImage={() => this.deleteImage(index)}
                        type={this.state.uploadImages.types[index]}
                        src={src.src}
                        width={src.width}
                        height={src.height}
                        key={index}
                        onClickPreviewImage={() =>
                          this.onClickPreviewImage(index)
                        }
                      />
                    );
                  })}
                </Box>
              </Box>
              <Box py={2}>
                <Button
                  variant="contained"
                  color="default"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={this.onChangeImageUpload}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box px={2}>
          <Box>
            <h1>Mô tả chi tiết sản phẩm</h1>
          </Box>
          <Divider />
          <Box mt={2}>
            <RichTextEditor
              value={this.state.product.content.value}
              onChangeEditorState={this.onChangeEditorState}
            />
            <Box>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.state.product.content.htmlStr,
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box px={2} display="flex">
          <Box mr={3} width="30%">
            <Button
              color="primary"
              variant="contained"
              onClick={this.submitProduct}
              fullWidth={true}
            >
              Đăng sản phẩm
            </Button>
          </Box>
          <Box mr={3} width="30%">
            <Button color="secondary" variant="contained" fullWidth={true}>
              Lưu bản nháp
            </Button>
          </Box>
          <Box width="30%">
            <Button color="default" variant="contained" fullWidth={true}>
              Hủy bỏ
            </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategory);
