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
  };
  optionComponent = () => {
    return (
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
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>
    );
  };
  componentDidMount() {
    this.props.dispatchLoading();
    // console.log(this.props.socket);
    // set remote description
    this.props.socket.on(
      `broadcaster.sdp.${this.props.socket.id}`,
      (watcherID, watcherSDP) => {
        console.log("SDP cua nguoi xem: " + watcherID + " la: " + watcherSDP);
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
        });
        this.props.dispatchLoaded();
        // emit thông báo cho server biết stream sẽ bắt đầu
        this.props.socket.emit("broadcasters", this.props.socket.id);
        const meme = document.querySelector("video");
        navigator.mediaDevices
          .getUserMedia({
            video: false,
            audio: true,
          })
          .then((vidStream) => {
            meme.srcObject = vidStream;
          });
        this.props.socket.on(
          `broadcaster.watchers.${this.props.socket.id}`,
          (watcherID) => {
            console.log("Nhận được id của watcher: " + watcherID);
            // add các track của MediaStream vào peer
            peerConns[watcherID] = new RTCPeerConnection(Config.configICE);
            // peerConns[watcherID].addStream(meme.srcObject);
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
      }
    });
  }
  componentWillUnmount() {
    if (this.state.loadcomplete)
      this.props.socket.emit("destroy", {
        broadcaster: getCookie("user_id"),
      });
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
