import React, { Component } from "react";
import { Config } from "../../../config/Config";

let peerConnection;

class Watcher extends Component {
  state = {};
  componentDidMount() {
    const video = document.querySelector("video");
    this.props.socket.emit("watchers", this.props.match.params.id);
    console.log("Đã gửi watcherID");
    this.props.socket.on(
      `watchers.sdp.${this.props.match.params.id}`,
      (broadcasterSDP) => {
        console.log("Nhan duoc broadcasterSDP: " + broadcasterSDP);
        peerConnection = new RTCPeerConnection(Config.configICE);
        peerConnection
          .setRemoteDescription(broadcasterSDP)
          .then(() => peerConnection.createAnswer())
          .then((sdp) => peerConnection.setLocalDescription(sdp))
          .then(() => {
            this.props.socket.emit(
              "SDPanswer",
              this.props.match.params.id,
              peerConnection.localDescription
            );
            console.log("Da gui localDescription cua watcher");
          });
        // thay đổi src video khi có track mới
        peerConnection.ontrack = (event) => {
          console.log(event.streams[0]);
          try {
            video.srcObject = event.streams[0];
            // video.onloadedmetadata = function (e) {
            //   video.play();
            // };
          } catch (err) {
            console.log(err);
          }
        };
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Setting candidate for watcher: " + event.candidate);
            this.props.socket.emit(
              "watchers.candidates",
              this.props.match.params.id,
              event.candidate
            );
          }
        };
      }
    );
    this.props.socket.on(
      `watchers.candidates.${this.props.match.params.id}`,
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
      `watchers.${this.props.match.params.id}`,
      (broadcasterID) => {
        console.log(broadcasterID);
      }
    );
  }
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
            id="video"
            width="400px"
            height="400px"
            // playsInline
            autoPlay
            controls
          ></video>
        </div>
      </div>
    );
  }
}

export default Watcher;
