import React, { Component } from "react";
import { Config } from "../../../config/Config";
import Meme from "../../../images/Video_meme_generator.mp4";

// const ss = require("socket.io-stream");
var peerConns = {};

class Livestreamer extends Component {
  state = {};
  componentDidMount() {}
  onClick = async () => {
    console.log(this.props.socket);
    // emit thông báo cho server biết stream sẽ bắt đầu
    this.props.socket.emit("broadcasters", this.props.socket.id);
    const meme = document.querySelector("video");
    const vidStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    meme.srcObject = vidStream;

    this.props.socket.on(
      `broadcaster.watchers.${this.props.socket.id}`,
      (watcherID) => {
        console.log("Nhận được id của watcher: " + watcherID);
        // add các track của MediaStream vào peer
        peerConns[watcherID] = new RTCPeerConnection(Config.configICE);
        peerConns[watcherID].addStream(vidStream);
        // vidStream
        //   .getTracks()
        //   .forEach((track) => peerConns[watcherID].addTrack(track));
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
  };
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            id="vid"
            src={Meme}
            width="400px"
            height="400px"
            autoPlay
            // playsInline
            muted
          ></video>
          <br />
          <button onClick={this.onClick}>Start livestream</button>
        </div>
      </div>
    );
  }
}

export default Livestreamer;
