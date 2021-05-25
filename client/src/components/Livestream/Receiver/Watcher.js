import { Box, IconButton } from "@material-ui/core";
import {
  EmojiEmotions,
  Favorite,
  PermIdentity,
  Share,
  ThumbUp,
} from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { joinStream } from "../../../apis/other-pool/OtherPool";
import { Config } from "../../../config/Config";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../../general/Loading";
import LivestreamTemplate from "../LivestreamTemplate";

let peerConnection;

class Watcher extends Component {
  state = {
    live_title: "",
    broadcaster_name: "",
    muted: false,
    loadcomplete: false,
    watchers: 2,
    timer: 0,
    created: null,
    emotions: {
      likes: 0,
      love: 0,
      haha: 0,
    },
  };
  optionComponent = () => {
    return (
      <Box>
        <input
          id="hiddenLink"
          style={{ visibility: "hidden" }}
          value={`Link tới livestream này: \n${window.location.href}`}
        />
        <Box display="flex" alignItems="center" justifyContent="center" p={1}>
          <Box mx={1}>
            <IconButton onClick={() => this.emitAction(1)}>
              <Favorite />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton onClick={() => this.emitAction(0)}>
              <ThumbUp />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton onClick={() => this.emitAction(2)}>
              <EmojiEmotions />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton onClick={() => this.shareLink()}>
              <Share />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton>
              <PermIdentity />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };
  emitAction = (actionID) => {
    this.props.socket.emit(
      "actions",
      this.props.match.params.broadcaster,
      this.props.match.params.id,
      actionID
    );
  };
  setTimer = () => {
    this.setState({
      timer: Math.round((new Date().getTime() - this.state.created) / 1000),
    });
  };
  shareLink = async () => {
    let hiddenLink = document.getElementById("hiddenLink");
    await navigator.clipboard.writeText(hiddenLink.value);
    toast.info("Đã sao chép");
  };
  componentDidMount() {
    this.props.socket.emit(
      "watchers",
      this.props.match.params.broadcaster,
      this.props.match.params.id
    );
    console.log("Đã gửi watcherID");
    this.props.socket.on(
      `watchers.add.${this.props.match.params.broadcaster}`,
      (watchers) => {
        this.setState({
          watchers: watchers,
        });
      }
    );
    joinStream(this.props.match.params.id).then((rs) => {
      if (rs.EC !== 0) {
        toast.error(rs.EM);
        this.props.dispatchLoaded();
        window.location.href = "/";
      } else {
        this.setState({
          live_title: rs.data.title,
          broadcaster_name: rs.data.name,
          loadcomplete: true,
          created: rs.data.created,
          emotions: { ...rs.data.emotions },
        });
        setInterval(() => this.setTimer(), 1000);
        this.props.dispatchLoaded();
        peerConnection = new RTCPeerConnection(Config.configICE);
        this.props.socket.on(
          `watchers.sdp.${this.props.match.params.broadcaster}`,
          (broadcasterSDP) => {
            console.log("Nhan duoc broadcasterSDP: " + broadcasterSDP);
            peerConnection
              .setRemoteDescription(broadcasterSDP)
              .then(() => peerConnection.createAnswer())
              .then((sdp) => peerConnection.setLocalDescription(sdp))
              .then(() => {
                this.props.socket.emit(
                  "SDPanswer",
                  this.props.match.params.broadcaster,
                  peerConnection.localDescription
                );
                console.log("Da gui localDescription cua watcher");
              });
            // thay đổi src video khi có track mới
            peerConnection.ontrack = (event) => {
              console.log(event.streams[0]);
              try {
                const video = document.querySelector("video");
                video.srcObject = event.streams[0];
              } catch (err) {
                console.log(err);
              }
            };
            peerConnection.onicecandidate = (event) => {
              if (event.candidate) {
                console.log(
                  "Setting candidate for watcher: " + event.candidate
                );
                this.props.socket.emit(
                  "watchers.candidates",
                  this.props.match.params.broadcaster,
                  event.candidate
                );
              }
            };
          }
        );
        this.props.socket.on(
          `watchers.candidates.${this.props.match.params.broadcaster}`,
          (broadcasterCandidate) => {
            console.log(
              "Nhan duoc Candidate cura broadcaster: " + broadcasterCandidate
            );
            peerConnection.addIceCandidate(
              new RTCIceCandidate(broadcasterCandidate)
            );
          }
        );
        this.props.socket.on(
          `watchers.${this.props.match.params.broadcaster}`,
          (broadcasterID) => {
            console.log(broadcasterID);
          }
        );
        this.props.socket.on(
          `watchers.leaving.${this.props.match.params.broadcaster}`,
          () => {
            this.setState({
              watchers: this.state.watchers - 1,
            });
          }
        );
      }
    });
  }
  componentWillUnmount() {
    clearInterval();
  }
  render() {
    if (this.props.loading || !this.state.live_title) {
      return (
        <Box>
          <ToastContainer />
          <Loading />
        </Box>
      );
    } else
      return (
        <LivestreamTemplate
          live_title={this.state.live_title}
          muted={this.state.muted}
          broadcaster_name={this.state.broadcaster_name}
          OptionComponent={this.optionComponent()}
          socket={this.props.socket}
          id={this.props.match.params.id}
          name={this.props.name}
          miniTitle={
            this.props.name
              ? `Chào ${this.props.name}, bạn đang xem livestream trên Hanoi Buffaloes. Hãy nói gì đó!`
              : null
          }
          timer={this.state.timer}
          watchers={this.state.watchers}
          broadcasterID={this.props.match.params.broadcaster}
          emotions={this.state.emotions}
        />
      );
  }
}

const mapStateToProps = (state) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Watcher);
