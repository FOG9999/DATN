import { Box, Divider, IconButton, OutlinedInput } from "@material-ui/core";
import {
  EmojiEmotions,
  Favorite,
  FiberManualRecord,
  Send,
  ThumbUp,
} from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { GeneralAction } from "../../redux/actions/GeneralAction";
import SimpleHeader from "../header/SimpleHeader";
// import Meme from "../../images/Video_meme_generator.mp4";
import { getUserAvatar } from "../../apis/user-pool/UserPool";
import { getCookie } from "../../others/functions/Cookie";
import OneStreamMessage from "./OneStreamMessage";
import { turnNumberToNumberWithSeperator } from "../../others/functions/checkTextForNumberInput";
import faker from "faker";

class LivestreamTemplate extends Component {
  state = {
    messages: [],
    text: "",
    avatar: "",
    likes: this.props.emotions.likes,
    love: this.props.emotions.love,
    haha: this.props.emotions.haha,
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
    // lắng nghe sự kiện tương tác (like, heart,...)
    this.props.socket.on(`actions.${this.props.broadcasterID}`, (actionID) => {
      switch (actionID) {
        case 0: {
          // like
          this.setState({
            likes: this.state.likes + 1,
          });
          break;
        }
        case 1: {
          // heart
          this.setState({
            love: this.state.love + 1,
          });
          break;
        }
        case 2: {
          // heart
          this.setState({
            haha: this.state.haha + 1,
          });
          break;
        }
        default:
          break;
      }
    });
  }
  sendMessage = () => {
    let messageToSend = {
      sender: this.props.name,
      text: this.state.text,
      time: new Date().toTimeString().substring(0, 5),
      avatar: this.state.avatar,
    };
    this.props.socket.emit("stream.messages", this.props.id, messageToSend);
    this.setState({
      text: "",
    });
  };
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  };
  showTimer = () => {
    let hour = Math.floor(this.props.timer / 3600);
    let min = Math.floor((this.props.timer - hour * 3600) / 60);
    let sec = this.props.timer - hour * 3600 - min * 60;
    return `${hour} ${hour < 2 ? "hour" : "hours"} ${min} ${
      min < 2 ? "min" : "mins"
    } ${sec} ${sec < 2 ? "sec" : "secs"}`;
  };
  render() {
    return (
      <Box height="100%">
        <SimpleHeader title="Livestream" miniTitle={this.props.miniTitle} />
        <ToastContainer />
        <Box
          display="flex"
          p={1}
          height="70%"
          id="container-div"
          style={{ position: "relative" }}
        >
          <Box id="video-panel-container" width="70%">
            <Box id="video-panel-title" m={1}>
              <Box py={1} display="flex">
                <Box display="flex" alignItems="center">
                  <b>{this.props.live_title}</b>
                </Box>
                <Box display="flex" mx={1} alignItems="center">
                  <FiberManualRecord className="color-red" />
                </Box>
                <Box display="flex" mx={1} alignItems="center">
                  <i>{this.showTimer()}</i>
                </Box>
              </Box>
              <Box className="color-aaa">
                {this.props.broadcaster_name}{" "}
                <i>
                  {turnNumberToNumberWithSeperator(this.props.watchers)} người
                  đang xem
                </i>
              </Box>
            </Box>
            <Box
              id="video-stream"
              style={{ minHeight: "500px", height: "70%" }}
            >
              <Box id="main-video-stream">
                {this.props.muted ? (
                  <video
                    autoPlay
                    //   src={Meme}
                    muted
                    width="100%"
                    height="100%"
                  ></video>
                ) : (
                  <video controls width="100%" height="100%"></video>
                )}
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
              <Box display="flex">
                <Box display="flex" alignItems="center" flexGrow={1}>
                  <ThumbUp style={{ color: "#286fad" }} />
                  &nbsp;{this.state.likes}
                </Box>
                <Box display="flex" alignItems="center" flexGrow={1}>
                  <Favorite style={{ color: "#d61522" }} />
                  &nbsp;{this.state.love}
                </Box>
                <Box display="flex" alignItems="center" flexGrow={1}>
                  <EmojiEmotions style={{ color: "#f0d50c" }} />
                  &nbsp;{this.state.haha}
                </Box>
              </Box>
              <Divider />
              <Box className="div-scroll" height="500px">
                {this.state.messages.map((message, ind) => {
                  return (
                    <OneStreamMessage
                      mymessage={this.props.name === message.sender}
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
                    value={this.state.text}
                    onChange={this.onChangeText}
                  />
                </Box>
                <Box display="flex" py={1} justifyContent="center">
                  <IconButton
                    disabled={!this.state.avatar}
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
