import { Box } from "@material-ui/core";
import React, { Component } from "react";
import group_chat from "../../../../images/group_chat.png";
import { getCookie } from "../../../../others/functions/Cookie";

const user_id = getCookie("user_id");

class OneConversation extends Component {
  state = {};
  displayName = () => {
    const conversation = { ...this.props.conversation };
    if (conversation.participants.length > 2) {
      return conversation.name;
    } else {
      const other = {
        ...conversation.participants.filter((us) => us._id !== user_id)[0],
      };
      return other.name;
    }
  };
  displayLastMessage = () => {
    const conversation = { ...this.props.conversation };
    const sender = { ...conversation.last_message.sender };
    if (String(sender._id) === user_id) {
      return conversation.last_message.file
        ? "Bạn: [File]"
        : `Bạn: ${conversation.last_message.text.substring(0, 50)}`;
    } else {
      return conversation.last_message.file
        ? `${conversation.last_message.sender.name}: [File]`
        : `${
            conversation.last_message.sender.name
          }: ${conversation.last_message.text.substring(0, 50)}`;
    }
  };
  render() {
    return (
      <Box
        display="flex"
        p={1}
        className="one-conversation-in-list cursor-pointer"
        onClick={() =>
          (window.location.href =
            "/m/manage/chat?id=" + this.props.conversation._id)
        }
      >
        <Box display="flex" alignItems="center">
          {this.props.conversation.participants.length > 2 ? (
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
                this.props.conversation.participants.filter(
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
        <Box p={1}>
          <Box p={1}>
            <big>
              {this.props.conversation.seen ? (
                this.displayName() // đã xem tin nhắn cuối
              ) : (
                <b>{this.displayName()}</b> // chưa xem tin nhắn cuối
              )}
            </big>
          </Box>
          {this.props.conversation.last_message ? (
            <Box className="color-aaa">
              {this.props.conversation.seen ? (
                this.displayLastMessage() // đã xem tin nhắn cuối
              ) : (
                <b>{this.displayLastMessage()}</b> // chưa xem tin nhắn cuối
              )}
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

export default OneConversation;
