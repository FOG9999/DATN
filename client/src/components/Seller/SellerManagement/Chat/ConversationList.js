import { Box, Button, TextField } from "@material-ui/core";
import { RotateLeft, Search } from "@material-ui/icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getUserConversations } from "../../../../apis/user-pool/UserPool";
import { Config } from "../../../../config/Config";
import { getCookie } from "../../../../others/functions/Cookie";
import { GeneralAction } from "../../../../redux/actions/GeneralAction";
import { UserAction } from "../../../../redux/actions/UserAction";
import Loading from "../../../general/Loading";
import OneConversation from "./OneConversation";

class ConversationList extends Component {
  state = {
    conversations: [],
  };
  getConversations = () => {
    this.props.dispatchLoading();
    if (this.props.logged) {
      const path = "/user-list/" + Config.ROLE.CLIENT;
      this.props.dispatchAuthen(path, "GET", (auth) => {
        if (auth.EC !== 0) {
          toast.error(auth.EM);
          this.props.dispatchLogout(() => {
            this.props.dispatchLoaded();
            window.location.href = "/";
          });
        } else {
          getUserConversations((rs) => {
            let sorted = [...rs.data.conversations];
            sorted.sort((cnv1, cnv2) => cnv2.last_changed - cnv1.last_changed);
            this.setState({
              conversations: [...sorted],
            });
            // lắng nghe xem có tin nhắn mới không, nếu có thì cập nhật list
            this.props.socket.on(`chat.${getCookie("user_id")}`, (data) => {
              this.updateWhenNewMessage(data.conversation);
            });
            this.props.dispatchLoaded();
          });
        }
      });
    }
  };
  // componentDidUpdate() {
  //   this.props.socket.on(`chat.${getCookie("user_id")}`, (data) => {
  //     this.updateWhenNewMessage(data.conversation);
  //   });
  // }

  updateWhenNewMessage = (conver) => {
    const indexOfConv = this.state.conversations
      .map((c, i) => c._id)
      .indexOf(conver._id);
    const { conversations } = this.state;
    conversations.splice(indexOfConv, indexOfConv + 1); // xóa cuộc hội thoại đã cũ
    conversations.unshift(conver); // chèn cuộc hội thoại đã update
    this.setState({
      conversations: [...conversations],
    });
  };
  componentDidMount() {
    this.getConversations(); // Do được gọi ở componentDIdMount nên khi có update socket sẽ bị reconnect và không còn lắng nghe trên kênh chat nữa
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
          <Box p={3}>
            <Box display="flex">
              <Box display="flex" flexGrow="1" alignItems="center">
                <Box display="flex" alignItems="center" pr={2}>
                  Tìm kiếm
                </Box>
                <TextField
                  size="small"
                  value={this.state.searchTitle}
                  //   onChange={this.onChangeSearchTitle}
                  placeholder="Tên sản phẩm"
                />
              </Box>
              <Box display="flex" flexGrow="1" alignItems="center">
                <Box display="flex" alignItems="center" pr={2}>
                  <Button className="backgroundcolor-orange color-white">
                    Tạo cuộc hội thoại mới
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box display="flex">
              <Box display="flex" alignItems="center" pr={1} py={1}>
                <Button
                  className="backgroundcolor-orange color-white"
                  // onClick={this.onClickSearch}
                >
                  <Search />
                  Tìm
                </Button>
              </Box>
              <Box display="flex" alignItems="center" p={1}>
                <Button
                  // onClick={this.resetSearch}
                  className="backgroundcolor-orange color-white"
                >
                  <RotateLeft />
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
          <Box m={2} minHeight="400px">
            {this.state.conversations.map((conv, ind) => {
              return <OneConversation conversation={conv} key={ind} />;
            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConversationList);
