import { Box, IconButton } from "@material-ui/core";
import { MicOff, Share, VideocamOff } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getStream } from "../../../apis/other-pool/OtherPool";
import { Config } from "../../../config/Config";
// import Meme from "../../../images/Video_meme_generator.mp4";
import { getCookie } from "../../../others/functions/Cookie";
import { GeneralAction } from "../../../redux/actions/GeneralAction";
import Loading from "../../general/Loading";
import LivestreamTemplate from "../LivestreamTemplate";

// const ss = require("socket.io-stream");
var peerConns = {};

class Livestreamer extends Component {
  state = {
    live_title: "",
    broadcaster_name: "",
    muted: true,
    loadcomplete: false,
    timer: 0,
    created: null,
    watchers: 1,
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
          value={`http://localhost:3000/watch/${this.props.match.params.id}/${this.props.socket.id}`}
        />
        <Box display="flex" alignItems="center" justifyContent="center" p={1}>
          <Box mx={1}>
            <IconButton>
              <VideocamOff />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton>
              <MicOff />
            </IconButton>
          </Box>
          <Box mx={1}>
            <IconButton onClick={() => this.shareLink()}>
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Box>
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
    this.props.dispatchLoading();
    // get stream
    getStream(this.props.match.params.id).then((rs) => {
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
        // emit thông báo cho server biết stream sẽ bắt đầu
        this.props.socket.emit("broadcasters", this.props.socket.id);
        const meme = document.querySelector("video");
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((vidStream) => {
            meme.srcObject = vidStream;
          });
        this.props.socket.on(
          `broadcaster.watchers.${this.props.socket.id}`,
          (watcherID) => {
            console.log("Nhận được id của watcher: " + watcherID);
            let watchers = this.state.watchers;
            this.setState({
              watchers: watchers + 1,
            });
            // add các track của MediaStream vào peer
            peerConns[watcherID] = new RTCPeerConnection(Config.configICE);
            peerConns[watcherID].addStream(meme.srcObject);
            // Sẽ được thực thi khi hai bên đã thiết lập SDP
            peerConns[watcherID].onicecandidate = (event) => {
              if (event.candidate) {
                console.log(
                  "Setting candidate for broadcaster: " + event.candidate
                );
                this.props.socket.emit(
                  "candidates",
                  this.props.socket.id,
                  event.candidate
                );
              }
            };
            // setup local sdp
            peerConns[watcherID]
              .createOffer()
              .then((sdp) => peerConns[watcherID].setLocalDescription(sdp))
              .then(() => {
                console.log(
                  "My local sdp: " + peerConns[watcherID].localDescription
                );
                this.props.socket.emit(
                  "sdp",
                  this.props.socket.id,
                  peerConns[watcherID].localDescription
                );
              });
          }
        );
        // set remote description
        this.props.socket.on(
          `broadcaster.sdp.${this.props.socket.id}`,
          (watcherID, watcherSDP) => {
            console.log(
              "SDP cua nguoi xem: " + watcherID + " la: " + watcherSDP
            );
            peerConns[watcherID].setRemoteDescription(watcherSDP);
          }
        );
        // set watcher candidate
        this.props.socket.on(
          `broadcaster.candidates.${this.props.socket.id}`,
          (watcherID, watcherCandidate) => {
            console.log("Watcher candidate: " + watcherCandidate);
            peerConns[watcherID].addIceCandidate(
              new RTCIceCandidate(watcherCandidate)
            );
          }
        );
        // lắng nghe mỗi khi có một socket leave
        this.props.socket.on("leaving", (socketID) => {
          if (Object.keys(peerConns).indexOf(socketID) >= 0) {
            this.setState({
              watchers: this.state.watchers - 1,
            });
            this.props.socket.emit("watchers.leaving", this.props.socket.id);
          }
        });
      }
    });
    // console.log(this.props.socket.id);
  }
  componentWillUnmount() {
    if (this.state.loadcomplete)
      this.props.socket.emit("destroy", {
        broadcaster: getCookie("user_id"),
      });
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
          miniTitle={`Chào ${this.props.name}, bạn đang livestream tại Hanoi Buffaloes. Enjoy!`}
          timer={this.state.timer}
          watchers={this.state.watchers}
          broadcasterID={this.props.socket.id}
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

export default connect(mapStateToProps, mapDispatchToProps)(Livestreamer);
