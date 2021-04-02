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

const itemCategories = [
  "Quần áo",
  "Đồ trang điểm",
  "Sách truyện",
  "Nhà bếp",
  "Phụ kiện trang bị",
  "Đồ dùng trong nhà",
];
const foodCategories = ["Rau xanh", "Hoa quả", "Trứng", "Thủy sản"];
const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));
const units = ["KG", "Quả", "Con"];
const statusArr = ["Đang vận chuyển", "Hàng mói về", "Hàng xả kho"];
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
  content: {
    value: RTE.createEmptyValue(),
    htmlStr: RTE.createEmptyValue().toString("html"),
  },
  price: "",
  status: "",
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
    },
    selectedImageIndex: -1,
    checkFields: [
      { name: "title", error: false },
      { name: "status", error: false },
      { name: "price", error: false },
      { name: "content", error: false },
      { name: "quantity", error: false },
    ],
  };
  componentDidMount() {
    let filereaders = [];
    for (let i = 0; i < 10; i++) {
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
  submitProduct = () => {
    let msg = "";
    for (let i = 0; i < this.state.checkFields.length; i++) {
      msg = this.checkValid(this.state.checkFields[i].name);
      if (!!msg) break;
    }
    if (!!msg) {
      toast.error(msg, undefined);
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
    const {
      imageFiles,
      imageNames,
      imageSrcs,
      filereaders,
    } = this.state.uploadImages;
    let files = [...e.target.files];
    let i = 0;
    files.forEach((file) => {
      imageFiles.push(file);
      imageNames.push(file.name);
      filereaders[i].onloadend = () => {
        let preview = filereaders[i].result;
        imageSrcs.push(preview);
      };
      filereaders[i].readAsDataURL(file);
      this.setState({
        uploadImages: {
          filereaders: [...filereaders],
          imageSrcs: [...imageSrcs],
          imageNames: [...imageNames],
          imageFiles: [...imageFiles],
        },
      });
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

  render() {
    return (
      <Box className="white-background" p={2}>
        <ToastContainer />
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
            </Box>
          ) : null}
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
            {this.state.proCategory === "Vật phẩm" ? null : (
              <Box display="flex">
                <Box pl={4} pr={2} py={1}>
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
          </Box>
          <Box mt={2} display="flex">
            <Box width="300px" pl={2} pt={4}>
              Hình ảnh cho sản phẩm
            </Box>
            <Box minWidth="800px">
              <Box py={2}>
                <Box
                  borderColor="#aaa"
                  border="1px solid #aaa"
                  display="flex"
                  flexWrap="wrap"
                  minHeight="350px"
                >
                  {this.state.uploadImages.imageSrcs.map((src, index) => {
                    return (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        m={1}
                      >
                        <img src={src} alt="" className="upload-image" />
                        <span className="close-btn">x</span>
                      </Box>
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

export default ProductCategory;
