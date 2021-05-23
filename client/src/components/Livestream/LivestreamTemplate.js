import { Box, Divider, IconButton, OutlinedInput } from "@material-ui/core";
import { FiberManualRecord, Send } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import SimpleHeader from "../header/SimpleHeader";
// import Meme from "../../images/Video_meme_generator.mp4";
import { getUserAvatar } from "../../apis/user-pool/UserPool";
import { getCookie } from "../../others/functions/Cookie";
import OneStreamMessage from "./OneStreamMessage";

class LivestreamTemplate extends Component {
  state = {
    messages: [],
    text: "",
    avatar: "",
  };
  componentDidMount() {
    let video = document.querySelector("video");
    video.srcObject = this.props.srcObjectStream;
    this.props.socket.on(`stream.messages.${this.props.id}`, (message) => {
      let messages = this.state.messages;
      messages.push(message);
      this.setState({
        messages: [...messages],
      });
    });
    if (getCookie("user_id")) {
      getUserAvatar(getCookie("user_id")).then((rs) => {
        this.setState({
          avatar: rs.data.avatar.avatar,
        });
      });
    } else {
      toast.warn("Bạn chưa đăng nhập nên không thể chat...");
    }
  }
  sendMessage = () => {
    let messageToSend = {
      sender: this.props.name,
      text: this.state.text,
      time: new Date().toTimeString().substring(0, 5),
      avatar: this.state.avatar,
    };
    this.props.socket.emit("stream.messages", messageToSend);
  };
  render() {
    return (
      <Box height="100%">
        <SimpleHeader title="Livestream" />
        <ToastContainer />
        <Box display="flex" p={1} height="70%">
          <Box id="video-panel-container" width="70%">
            <Box id="video-panel-title" m={1}>
              <Box py={1}>
                <b>{this.props.live_title}</b>
              </Box>
              <Box className="color-aaa" display="flex" alignItems="center">
                {this.props.broadcaster_name}
                <Box display="flex" alignItems="center">
                  <FiberManualRecord color="action" />
                </Box>
              </Box>
            </Box>
            <Box
              id="video-stream"
              style={{ minHeight: "500px", height: "70%" }}
            >
              <Box id="main-video-stream">
                <video
                  constrols
                  //   src={Meme}
                  muted={this.props.muted}
                  width="100%"
                  height="100%"
                ></video>
              </Box>
            </Box>
            <Box id="stream-options">{this.props.OptionComponent}</Box>
          </Box>
          <Box id="chat-panel-container" p={1} width="30%" height="100%">
            <Box
              id="chat-panel"
              borderRadius="10px"
              p={1}
              className="white-background"
            >
              <Box py={1}>
                <big>
                  <b>Live Chat</b>
                </big>
              </Box>
              <Divider />
              <Box className="div-scroll" height="500px">
                {this.state.messages.map((message, ind) => {
                  return (
                    <OneStreamMessage
                      mymessage={this.props.name === message.name}
                      message={message}
                      key={ind}
                    />
                  );
                })}
              </Box>
              <Box display="flex" py={1} justifyContent="center">
                <Box p={1} flexGrow={1}>
                  <OutlinedInput
                    rowsMax={5}
                    multiline={true}
                    fullWidth={true}
                    className="no-outline"
                    //   value={this.state.text}
                    //   onChange={this.onChangeText}
                  />
                </Box>
                <Box display="flex" py={1} justifyContent="center">
                  <IconButton
                    disabled={this.state.avatar}
                    onClick={this.sendMessage}
                  >
                    <Send fontSize="small" />
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
    name: state.user.name,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LivestreamTemplate);
