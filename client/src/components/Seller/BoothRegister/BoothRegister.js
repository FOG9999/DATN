import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@material-ui/core";
import React, { Component } from "react";
import { CloudUpload } from "@material-ui/icons";
import RichTextEditor from "../../upload/description/RichTextEditor";
import RTE from "react-rte";
import cNd from "../../../others/convincesAndDistricts.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  turnNumberWithSeperatorIntoNumber,
  turnNumberToNumberWithSeperator,
} from "../../../others/functions/checkTextForNumberInput";
import PreviewImage from "../../upload/image_upload/PreviewImage";
import MainImgModal from "../../upload/image_upload/MainImgModal";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const convincesAndDistricts = JSON.parse(JSON.stringify(cNd));
const maxImageLimit = 12;
const strings = {
  requiredBoothTitle: "Tên gian hàng không được để trống",
  requiredOrganizationName: "Tên tổ chức còn thiếu",
  requiredBoothContent:
    "Vui lòng cung cấp thông tin mô tả gian hàng hay tổ chức",
  tooLongBoothTitle: "Tên gian hàng quá dài",
  tooLongName: "Tên tổ chức của bạn quá dài",
  minLengthProContent: 100,
  maxLengthTitle: 80,
  maxLengthName: 80,
  moreDetail: "Vui lòng cung cấp thêm thông tin cho gian hàng",
  requiredPopulation: "Điền số lượng thành viên tổ chức",
  enterNumber: "Vui lòng nhập giá trị số cho trường này",
  tooManyImages: `Số lượng ảnh đăng tối đa là ${maxImageLimit}`,
  maxImageLimit: maxImageLimit,
  fileTooLarge: "File ảnh quá lớn",
};

class BoothRegister extends Component {
  state = {
    booth: {
      title: "",
      organizationName: "",
      population: "",
      location: {
        street: convincesAndDistricts[1].districts[0].streets[0].name,
        district: convincesAndDistricts[1].districts[0].name,
        convince: convincesAndDistricts[1].name,
      },
      activeFrom: new Date(),
      activeTo: null,
      content: {
        value: RTE.createEmptyValue(),
        htmlStr: RTE.createEmptyValue().toString("html"),
      },
      leaderName: "",
      phone: "",
    },
    uploadImages: {
      filereaders: [],
      imageSrcs: [],
      imageNames: [],
      imageFiles: [],
    },
    showView: false,
    selectedImageIndex: -1,
    checkFields: [
      { name: "title", error: false },
      { name: "organizationName", error: false },
      { name: "population", error: false },
      { name: "content", error: false },
      { name: "leaderName", error: false },
      { name: "phone", error: false },
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
    let value = this.state.booth[fieldName];
    let msg = "";
    switch (fieldName) {
      case "title": {
        if (!value) {
          msg = strings.requiredBoothTitle;
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
          msg = strings.tooLongBoothTitle;
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
      case "organizationName": {
        if (!value) {
          msg = strings.requiredOrganizationName;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "organizationName") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        } else if (value.length > strings.maxLengthName) {
          msg = strings.tooLongName;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "organizationName") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      case "population": {
        if (!value) {
          msg = strings.requiredPopulation;
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "population") {
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
          msg = strings.requireBoothContent;
        } else if (value.length < strings.minLengthBoothContent) {
          msg = strings.moreDetail;
        }
        break;
      }
      case "leaderName": {
        if (!value) {
          msg = "Vui lòng cung cấp tên của người đứng đầu";
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "leaderName") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        } else if (value.length < 10) {
          msg = "Tên quá ngắn!";
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "leaderName") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      case "phone": {
        if (!value) {
          msg = "Vui lòng nhập số điện thoại";
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "phone") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        } else if (value.length !== 10) {
          msg = "Số điện thoại không hợp lệ";
          let oldCheckFields = this.state.checkFields;
          oldCheckFields.forEach((field) => {
            if (field.name !== "phone") {
              field.error = false;
            } else field.error = true;
          });
          this.setState({
            checkFields: [...oldCheckFields],
          });
        }
        break;
      }
      default:
        break;
    }

    if (msg && fieldName !== "content")
      document.getElementById(`id${fieldName}`).focus();
    return msg;
  };
  deleteImage = (index) => {
    const { imageSrcs, imageNames, imageFiles } = this.state.uploadImages;
    imageSrcs.splice(index, 1);
    imageFiles.splice(index, 1);
    imageNames.splice(index, 1);
    this.setState({
      uploadImages: {
        ...this.state.uploadImages,
        imnageSrcs: [...imageSrcs],
        imageFiles: [...imageFiles],
        imageNames: [...imageNames],
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
    }
  };

  onChangeLocation = (e) => {
    let newLocation = { ...this.state.booth.location };
    switch (e.target.name) {
      case "street": {
        newLocation.street = e.target.value;
        this.setState({
          booth: {
            ...this.state.booth,
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
          booth: {
            ...this.state.booth,
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
      booth: {
        ...this.state.booth,
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
        let preview = new Image();
        preview.src = filereaders[i].result;
        // Sau khi filereader đã đọc xong và ảnh đã được load lên (preview.onload) thì ms push vào imageSrcs
        preview.onload = () => {
          imageSrcs.push({
            src: preview.src,
            width: preview.naturalWidth,
            height: preview.naturalHeight,
          });
          this.setState({
            uploadImages: {
              filereaders: [...filereaders],
              imageSrcs: [...imageSrcs],
              imageNames: [...imageNames],
              imageFiles: [...imageFiles],
            },
          });
        };
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
  onChangeActiveFrom = (date) => {
    this.setState({
      booth: {
        ...this.state.booth,
        activeFrom: date,
      },
    });
  };
  onChangeActiveTo = (date) => {
    this.setState({
      booth: {
        ...this.state.booth,
        activeTo: date,
      },
    });
  };
  onChangeInputField = (e) => {
    // console.log(e.target);
    switch (e.target.type) {
      case "radio": {
        // never come here
        if (e.target.checked)
          this.setState({
            booth: {
              ...this.state.booth,
              [e.target.name]: e.target.value,
            },
          });
        break;
      }
      default:
        if (e.target.name === "population") {
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
              booth: {
                ...this.state.booth,
                [e.target.name]: turnNumberWithSeperatorIntoNumber(
                  e.target.value.toString()
                ),
              },
            });
            break;
          }
        } else if (e.target.name === "phone") {
          if (!!e.target.value && /\D/i.test(e.target.value)) {
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
              booth: {
                ...this.state.booth,
                [e.target.name]: e.target.value,
              },
            });
            break;
          }
        } else {
          // console.log("check");
          this.setState({
            booth: {
              ...this.state.booth,
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
              width: this.state.uploadImages.imageSrcs[
                this.state.selectedImageIndex
              ].width,
              height: this.state.uploadImages.imageSrcs[
                this.state.selectedImageIndex
              ].height,
              src: this.state.uploadImages.imageSrcs[
                this.state.selectedImageIndex
              ].src,
            }}
          />
        ) : null}
        <Box px={2}>
          <h1>Các thông tin chung</h1>
        </Box>
        <Divider />
        <Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Tên gian hàng
            </Box>
            <Box width="800px">
              <TextField
                onChange={this.onChangeInputField}
                size="small"
                name="title"
                value={this.state.booth.title}
                variant="outlined"
                fullWidth={true}
                error={this.state.checkFields[0].error}
                id="idtitle"
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Tên tổ chức
            </Box>
            <Box width="800px">
              <TextField
                onChange={this.onChangeInputField}
                size="small"
                name="organizationName"
                value={this.state.booth.organizationName}
                variant="outlined"
                fullWidth={true}
                error={this.state.checkFields[1].error}
                id="idorganizationName"
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Người đứng đầu
            </Box>
            <Box width="550px">
              <TextField
                error={this.state.checkFields[4].error}
                size="small"
                name="leaderName"
                onChange={this.onChangeInputField}
                value={this.state.booth.leaderName}
                variant="outlined"
                id="idleaderName"
                fullWidth={true}
                placeholder="Họ tên"
              />
            </Box>
            <Box ml={3}>
              <TextField
                error={this.state.checkFields[5].error}
                size="small"
                name="phone"
                onChange={this.onChangeInputField}
                value={this.state.booth.phone}
                variant="outlined"
                id="idphone"
                placeholder="Số điện thoại"
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Bắt đầu từ ngày
            </Box>
            <Box width="800px">
              <ReactDatePicker
                selected={this.state.booth.activeFrom}
                onChange={this.onChangeActiveFrom}
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Kéo dài tới
            </Box>
            <Box width="800px">
              <ReactDatePicker
                selected={this.state.booth.activeTo}
                onChange={this.onChangeActiveTo}
              />
            </Box>
          </Box>
          <Box display="flex" mt={2}>
            <Box width="300px" pl={2} py={1}>
              Địa chỉ tổ chức
            </Box>
            <Box display="flex">
              <Box mr={2}>
                <Select
                  value={this.state.booth.location.street}
                  name="street"
                  onChange={this.onChangeLocation}
                >
                  {convincesAndDistricts[1].districts
                    .filter(
                      (dis) => dis.name === this.state.booth.location.district
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
                  value={this.state.booth.location.district}
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
                  value={this.state.booth.location.convince}
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
              Số lượng thành viên
            </Box>
            <Box>
              <TextField
                error={this.state.checkFields[2].error}
                size="small"
                name="population"
                onChange={this.onChangeInputField}
                value={turnNumberToNumberWithSeperator(
                  this.state.booth.population
                )}
                variant="outlined"
                id="idpopulation"
              />
            </Box>
          </Box>
          <Box mt={2} display="flex">
            <Box width="300px" pl={2} pt={4}>
              Hình ảnh minh chứng hoạt động
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
            <h1>Các thông tin mô tả chi tiết về tổ chức hay gian hàng</h1>
          </Box>
          <Divider />
          <Box mt={2}>
            <RichTextEditor
              value={this.state.booth.content.value}
              onChangeEditorState={this.onChangeEditorState}
            />
            <Box>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.state.booth.content.htmlStr,
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

export default BoothRegister;
