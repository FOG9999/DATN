import { Box, Button, IconButton, TextField } from "@material-ui/core";
import React, { Component } from "react";
import faker from "faker";
import { getCookie } from "../../../others/functions/Cookie";
import { Close, CloudUpload, Publish, Send } from "@material-ui/icons";
import { toast } from "react-toastify";
import { uploadImageFile } from "../../../apis/other-pool/OtherPool";
import { UserAction } from "../../../redux/actions/UserAction";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import { connect } from "react-redux";
import { replyComment } from "../../../apis/item-pool/ItemPool";
import { Config } from "../../../config/Config";

class OneComment extends Component {
  state = {
    reply_text: "",
    upload: {
      upfiles: [],
      upnames: [],
      upsrcs: [],
      uptypes: [],
    },
    openReply: false,
  };
  onChangeReplyText = (e) => {
    this.setState({
      reply_text: e.target.value,
    });
  };
  onChangeReplyUpload = (e) => {
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
  toggleReply = () => {
    this.setState({
      openReply: !this.state.openReply,
    });
  };
  onReply = () => {
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
            let reply = {
              text: this.state.reply_text,
              files: [...transformedImageNames],
              // product: this.props.prd_id,
            };
            const path = "/cmt/" + Config.ROLE.CLIENT + "/reply";
            this.props.dispatchAuthen(path, "POST", (auth) => {
              if (auth.EC !== 0) {
                toast.error(auth.EM);
                this.props.dispatchLogout(() => {
                  this.props.dispatchLoaded();
                  window.location.href = "/";
                });
              } else {
                // post comment API here
                replyComment(this.props.comment._id, reply).then((rs) => {
                  if (rs.EC !== 0) {
                    toast.error(rs.EM);
                    this.props.dispatchLoaded();
                  } else {
                    this.props.refreshComments();
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
        let reply = {
          text: this.state.reply_text,
          files: [...transformedImageNames],
          // product: this.props.prd_id,
        };
        const path = "/cmt/" + Config.ROLE.CLIENT + "/reply";
        this.props.dispatchAuthen(path, "POST", (auth) => {
          if (auth.EC !== 0) {
            toast.error(auth.EM);
            this.props.dispatchLogout(() => {
              this.props.dispatchLoaded();
              window.location.href = "/";
            });
          } else {
            // post comment API here
            replyComment(this.props.comment._id, reply).then((rs) => {
              if (rs.EC !== 0) {
                toast.error(rs.EM);
                this.props.dispatchLoaded();
              } else {
                this.props.refreshComments();
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
    if (this.props.comment)
      return (
        <Box pl={4} my={1}>
          <Box display="flex">
            <Box display="flex" alignItems="center" justifyContent="center">
              <img
                src={this.props.comment.user.avatar}
                className="one-comment-user-avatar"
                alt=""
              />
            </Box>
            <Box
              ml={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <small>
                <b>{this.props.comment.user.name}</b>
              </small>
            </Box>
          </Box>
          <Box>
            <Box py={1}>{this.props.comment.text}</Box>
            <Box display="flex" flexWrap="wrap">
              {this.props.comment.files.map((file, index) => {
                return (
                  <Box key={index} pr={1} py={1}>
                    {!file.link.includes("mp4") &&
                    !file.link.includes("webm") ? (
                      <img
                        src={file.link}
                        alt=""
                        width="50px"
                        height="50px"
                        key={index}
                      />
                    ) : (
                      <video
                        controls
                        key={index}
                        width="250px"
                        height="250px"
                        src={file.link}
                      ></video>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
          {getCookie("user_id") !== this.props.prd_id &&
          !this.props.comment.reply ? (
            <Box display="flex">
              <Box px={1} className="cursor-pointer">
                <small>Thích</small>
              </Box>
              <Box px={1} className="cursor-pointer" onClick={this.toggleReply}>
                <small>{this.state.openReply ? "Đóng" : "Trả lời"}</small>
              </Box>
            </Box>
          ) : null}
          {this.props.comment.reply ? (
            <Box pl="60px">
              <Box display="flex">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <img
                    src={this.props.comment.reply.seller.avatar}
                    className="one-comment-user-avatar"
                    alt=""
                  />
                </Box>
                <Box
                  ml={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <small>
                    <b>{this.props.comment.reply.seller.name}</b>
                  </small>
                </Box>
              </Box>
              <Box>
                <Box py={1}>{this.props.comment.reply.text}</Box>
                <Box display="flex" flexWrap="wrap">
                  {this.props.comment.reply.files.map((file, index) => {
                    return (
                      <Box key={index} pr={1} py={1}>
                        {!file.link.includes("mp4") &&
                        !file.link.includes("webm") ? (
                          <img
                            src={file.link}
                            alt=""
                            width="50px"
                            height="50px"
                            key={index}
                          />
                        ) : (
                          <video
                            controls
                            key={index}
                            width="250px"
                            height="250px"
                            src={file.link}
                          ></video>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          ) : this.props.isSeller && this.state.openReply ? (
            <Box pl="60px" py={1}>
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
                <Box mx={1} display="flex" alignItems="center" width="70%">
                  <TextField
                    size="small"
                    value={this.state.reply_text}
                    fullWidth
                    onChange={this.onChangeReplyText}
                    placeholder="Trả lời"
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
                    onChange={this.onChangeReplyUpload}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton aria-label="upload picture" component="span">
                      <Publish />
                    </IconButton>
                  </label>
                </Box>
                <Box mx={1} display="flex" alignItems="center">
                  <IconButton onClick={this.onReply}>
                    <Send fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>
      );
    else return null;
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

export default connect(mapStateToProps, mapDispatchToProps)(OneComment);
