import { Box, Divider, IconButton, TextField } from "@material-ui/core";
import React, { Component } from "react";
import OneComment from "./OneComment";
import { UserAction } from "../../../redux/actions/UserAction";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { connect } from "react-redux";
import {
  getCommentsOnPrd,
  postComment,
} from "../../../apis/item-pool/ItemPool";
import { toast } from "react-toastify";
import { Close, Publish, Send } from "@material-ui/icons";
import { uploadImageFile } from "../../../apis/other-pool/OtherPool";
import { Config } from "../../../config/Config";
import { getCookie } from "../../../others/functions/Cookie";

class Comment extends Component {
  state = {
    comments: [],
    text: "",
    upload: {
      upfiles: [],
      upnames: [],
      upsrcs: [],
      uptypes: [],
    },
    isSeller: false,
  };
  componentDidMount() {
    this.getComments();
  }
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  };
  onChangeUpload = (e) => {
    let files = e.target.files;
    if (this.state.upload.upfiles.length + files.length >= 8) {
      toast.error("Số lượng file không vượt quá 8!");
      return;
    }
    const { upfiles, upnames, upsrcs, uptypes } = this.state.upload;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let reader = new FileReader();
      if (file.size / 1000000 > 25) {
        toast.error("File quá lớn");
        return;
      }
      upfiles.push(file);
      upnames.push(file.name);
      reader.onloadend = () => {
        upsrcs.push(reader.result);
        if (file.type.includes("image")) {
          uptypes.push("I");
        } else if (file.type.includes("video")) {
          uptypes.push("V");
        }
        this.setState({
          upload: {
            upsrcs: [...upsrcs],
            upnames: [...upnames],
            upfiles: [...upfiles],
            uptypes: [...uptypes],
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };
  deleteImage = (index) => {
    const { upsrcs, upnames, upfiles, uptypes } = this.state.upload;
    upsrcs.splice(index, 1);
    upfiles.splice(index, 1);
    upnames.splice(index, 1);
    uptypes.splice(index, 1);
    this.setState({
      upload: {
        ...this.state.upload,
        upsrcs: [...upsrcs],
        upfiles: [...upfiles],
        uptypes: [...uptypes],
        upnames: [...upnames],
      },
    });
  };
  getComments = () => {
    this.props.dispatchLoading();
    const path = "/cmt/CLIENT/on-prd";
    getCommentsOnPrd(this.props.prd_id).then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        this.props.dispatchLoaded();
      } else {
        this.setState({
          comments: [...rs.data.comments],
          isSeller: rs.data.isSeller,
        });
        this.props.dispatchLoaded();
      }
    });
  };
  onPostComment = () => {
    if (this.props.logged) {
      if (this.state.upload.upfiles.length) {
        uploadImageFile(this.state.upload.upfiles, (uploadRS) => {
          if (uploadRS.EC !== 0) {
            toast.error(uploadRS.EM);
            this.props.dispatchLoaded();
          } else {
            let transformedImageNames = this.state.upload.upnames.map(
              (name, ind) => `${Config.UploadServer}/public/img/${name}`
            );
            let comment = {
              text: this.state.text,
              user: getCookie("user_id"),
              files: [...transformedImageNames],
              product: this.props.prd_id,
            };
            const path = "/cmt/" + Config.ROLE.CLIENT + "/post";
            this.props.dispatchAuthen(path, "POST", (auth) => {
              if (auth.EC !== 0) {
                toast.error(auth.EM);
                this.props.dispatchLogout(() => {
                  this.props.dispatchLoaded();
                  window.location.href = "/";
                });
              } else {
                // post comment API here
                postComment(comment).then((rs) => {
                  if (rs.EC !== 0) {
                    toast.error(rs.EM);
                    this.props.dispatchLoaded();
                  } else {
                    this.getComments();
                  }
                });
                this.setState({
                  text: "",
                  upload: {
                    upfiles: [],
                    upnames: [],
                    upsrcs: [],
                    uptypes: [],
                  },
                });
              }
            });
          }
        });
      } else {
        let transformedImageNames = this.state.upload.upnames.map(
          (name, ind) => `${Config.UploadServer}/public/img/${name}`
        );
        let comment = {
          text: this.state.text,
          user: getCookie("user_id"),
          files: [...transformedImageNames],
          product: this.props.prd_id,
        };
        const path = "/cmt/" + Config.ROLE.CLIENT + "/post";
        this.props.dispatchAuthen(path, "POST", (auth) => {
          if (auth.EC !== 0) {
            toast.error(auth.EM);
            this.props.dispatchLogout(() => {
              this.props.dispatchLoaded();
              window.location.href = "/";
            });
          } else {
            // post comment API here
            postComment(comment).then((rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
                this.props.dispatchLoaded();
              } else {
                this.getComments();
              }
            });
            this.setState({
              text: "",
              upload: {
                upfiles: [],
                upnames: [],
                upsrcs: [],
                uptypes: [],
              },
            });
          }
        });
      }
    } else {
      toast.error("You are not logged in. Bring you back to homepage in 2s...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };
  render() {
    return (
      <Box className="white-background" mt={2}>
        <Box p={2}>
          <big>Binh luận trên sản phẩm</big>
        </Box>
        <Divider />
        <Box pt={2}>
          {this.state.comments.map((comment, index) => {
            return (
              <OneComment
                prd_id={this.props.prd_id}
                comment={comment}
                key={index}
                isSeller={this.state.isSeller}
                refreshComments={this.getComments}
              />
            );
          })}
        </Box>
        <Box pl={4} py={1}>
          <Box py={1} display="flex">
            {this.state.upload.upsrcs.map((src, ind) => {
              return (
                <Box m="2px" position="relative">
                  <Box
                    display="flex"
                    flexDirection="row-reverse"
                    position="absolute"
                    top="0px"
                    zIndex="1"
                  >
                    <IconButton onClick={() => this.deleteImage(ind)}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    maxWidth="150px"
                    maxHeight="120px"
                  >
                    {this.state.upload.uptypes[ind] === "I" ? (
                      <img
                        src={src}
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                        alt=""
                        // onClick={this.props.onClickPreviewImage}
                        className="cursor-pointer sending-images"
                        key={ind}
                      />
                    ) : (
                      <video
                        controls
                        width="150px"
                        src={src}
                        key={ind}
                        style={{ margin: "2px" }}
                      ></video>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box display="flex">
            <Box mx={1} display="flex" flexGrow={1} alignItems="center">
              <TextField
                size="small"
                value={this.state.text}
                fullWidth
                onChange={this.onChangeText}
                placeholder="Bình luận"
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx={1}
            >
              <input
                type="file"
                hidden
                multiple
                id="icon-button-file"
                // accept="image/*"
                onChange={this.onChangeUpload}
              />
              <label htmlFor="icon-button-file">
                <IconButton aria-label="upload picture" component="span">
                  <Publish />
                </IconButton>
              </label>
            </Box>
            <Box mx={1} display="flex" alignItems="center">
              <IconButton onClick={this.onPostComment}>
                <Send fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.general.loading,
    logged: state.user.logged,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
