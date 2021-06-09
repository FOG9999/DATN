import React, { Component } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  OutlinedInput,
} from "@material-ui/core";
import { ArrowBackIos, Close, Publish, Send } from "@material-ui/icons";
import loading from "../../../../images/mess_loading.gif";
import OneMessage from "./OneMessage";
import { getCookie } from "../../../../others/functions/Cookie";
import { connect } from "react-redux";
import { Config } from "../../../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import {
  getConversation,
  uploadImageFile,
} from "../../../../apis/other-pool/OtherPool";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import group_chat from "../../../../images/group_chat.png";
import Loading from "../../../general/Loading";

const user_id = getCookie("user_id");

class Conversation extends Component {
  state = {
    loading: false,
    page: 1,
    pagesize: 15,
    messages: [],
    conID: new URLSearchParams(window.location.search).get("id"),
    firsttime: true,
    conversation: null,
    text: "",
    upload: {
      upfiles: [],
      upnames: [],
      upsrcs: [],
      uptypes: [],
    },
  };
  displayName = () => {
    const conversation = { ...this.state.conversation };
    if (conversation.participants.length > 2) {
      return conversation.name;
    } else {
      const other = {
        ...conversation.participants.filter((us) => us._id !== user_id)[0],
      };
      return other.name;
    }
  };
  getConversation = (done) => {
    const { page, pagesize, conID } = this.state;
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/conversation/" + Config.ROLE.CLIENT;
      this.props.dispatchAuthen(path, "GET", (auth) => {
        if (auth.EC !== 0) {
          toast.error(auth.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
        } else {
          getConversation(conID, page, pagesize, (rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
              this.props.dispatchLoaded();
            } else {
              this.props.dispatchLoaded();
              rs.data.messages.reverse();
              this.setState({
                messages: [...rs.data.messages],
                conversation: { ...rs.data.conversation._doc },
                firsttime: false,
              });
              done();
            }
          });
        }
      });
    }
  };
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.loading && prevState.firsttime) {
      setTimeout(() => {
        // xuống dưới đáy thẻ div để nhìn thấy tin nhắn cuối
        document.querySelector(".div-scroll").scrollTop =
          document.querySelector(".div-scroll").scrollHeight;
        window.scrollTo(
          0,
          document.querySelector(".white-background").scrollHeight
        );
      });
    } else if (prevState.messages.length !== this.state.messages.length) {
      setTimeout(() => {
        document.querySelector(".div-scroll").scrollTop =
          document.querySelector(".div-scroll").scrollHeight;
      });
    }
  }
  componentDidMount() {
    this.getConversation(() => {
      this.props.socket.on("room." + getCookie("user_id"), (data) => {
        const { messages } = this.state;
        messages.push(data.message);
        this.setState({
          messages: [...messages],
        });
        this.props.socket.emit("seen", {
          conID: this.state.conversation._id,
          user_id: getCookie("user_id"),
        });
      });
    });
  }
  onChangeImageUpload = (e) => {
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
  onSendMessage = () => {
    if (this.props.logged) {
      if (this.state.upload.upfiles.length) {
        uploadImageFile(this.state.upload.upfiles, (uploadRS) => {
          if (uploadRS.EC !== 0) {
            toast.error(uploadRS.EM);
          } else {
            let transformedImageNames = this.state.upload.upnames.map(
              (name, ind) => `${Config.UploadServer}/public/img/${name}`
            );
            let upmessage = {
              text: this.state.text,
              sender: getCookie("user_id"),
              files: [...transformedImageNames],
            };
            this.props.socket.emit("listen", {
              new_message: { ...upmessage },
              conID: this.state.conversation._id,
            });
            this.setState({
              text: "",
            });
          }
        });
      } else {
        let transformedImageNames = this.state.upload.upnames.map(
          (name, ind) => `${Config.UploadServer}/public/img/${name}`
        );
        let upmessage = {
          text: this.state.text,
          sender: getCookie("user_id"),
          files: [...transformedImageNames],
        };
        this.props.socket.emit("listen", {
          new_message: { ...upmessage },
          conID: this.state.conversation._id,
        });
        this.setState({
          text: "",
        });
      }
    } else {
      toast.error("You are not logged in. Bring you back to homepage in 2s...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
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
  render() {
    if (this.props.loading || this.state.firsttime) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <Box m="auto" minWidth="800px" my="30px" className="white-background">
          <Box display="flex" p={2}>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() =>
                  (window.location.href = "/m/manage/conversations")
                }
              >
                <ArrowBackIos />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              {this.state.conversation.participants.length > 2 ? (
                <img
                  src={group_chat}
                  alt=""
                  width="50px"
                  height="50px"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <img
                  src={
                    this.state.conversation.participants.filter(
                      (us) => us._id !== user_id
                    )[0].avatar
                  }
                  alt=""
                  width="50px"
                  height="50px"
                  style={{ borderRadius: "50%" }}
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" m={2}>
              <big>
                <b>{this.displayName()}</b>
              </big>
            </Box>
          </Box>
          <Divider />
          <Box p={2}>
            {this.state.loading ? (
              <Box display="flex" p={2} justifyContent="center">
                <img src={loading} width="40px" height="40px" alt="" />
              </Box>
            ) : null}
            <Box minHeight="400px" maxHeight="600px" className="div-scroll">
              {this.state.messages.map((message, index) => {
                return (
                  <OneMessage
                    me={String(message.sender._id) === user_id}
                    key={index}
                    message={message}
                  />
                );
              })}
            </Box>
            <Box p={2}>
              <Box>
                <Box display="flex" p={2}>
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
                <Box display="flex" p={1} justifyContent="center">
                  <Box p={1} flexGrow={1}>
                    <OutlinedInput
                      rowsMax={5}
                      multiline={true}
                      fullWidth={true}
                      className="no-outline"
                      value={this.state.text}
                      onChange={this.onChangeText}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <input
                      type="file"
                      hidden
                      multiple
                      id="icon-button-file"
                      // accept="image/*"
                      onChange={this.onChangeImageUpload}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton aria-label="upload picture" component="span">
                        <Publish />
                      </IconButton>
                    </label>
                  </Box>
                  <Box display="flex" p={1} justifyContent="center">
                    <IconButton onClick={this.onSendMessage}>
                      <Send fontSize="large" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
