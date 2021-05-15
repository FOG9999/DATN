import React, { Component } from "react";
import { Box, Divider, IconButton, OutlinedInput } from "@material-ui/core";
import { ArrowBackIos, Publish, Send } from "@material-ui/icons";
import loading from "../../../../images/mess_loading.gif";
import OneMessage from "./OneMessage";
import { getCookie } from "../../../../others/functions/Cookie";
import { connect } from "react-redux";
import { Config } from "../../../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import { getConversation } from "../../../../apis/other-pool/OtherPool";
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
          this.props.dispatchLoaded();
        } else {
          getConversation(conID, page, pagesize, (rs) => {
            if (rs.EC !== 0) {
              toast.error(rs.EM);
              this.props.dispatchLoaded();
            } else {
              this.props.dispatchLoaded();
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
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.loading && prevState.firsttime) {
      console.log("xxx");
      setTimeout(() => {
        document.querySelector(".div-scroll").scrollTop =
          document.querySelector(".div-scroll").scrollHeight;
        window.scrollTo(
          0,
          document.querySelector(".white-background").scrollHeight
        );
      });
    }
  }
  componentDidMount() {
    this.getConversation(() => {});
  }
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
              <IconButton>
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
            <Box display="flex" alignItems="center">
              {this.displayName()}
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
            <Box display="flex" p={2}>
              <Box display="flex" flexGrow={1}>
                <Box flexGrow={1}>
                  {/* <Box></Box> */}
                  <Box p={1}>
                    <OutlinedInput
                      rowsMax={5}
                      multiline={true}
                      fullWidth={true}
                      className="no-outline"
                    />
                  </Box>
                </Box>
                <Box display="flex" p={1} justifyContent="center">
                  <IconButton>
                    <Publish />
                  </IconButton>
                </Box>
                <Box display="flex" p={1} justifyContent="center">
                  <IconButton>
                    <Send fontSize="large" />
                  </IconButton>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
