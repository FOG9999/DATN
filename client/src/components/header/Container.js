import React, { Component } from "react";
import { Container } from "@material-ui/core";
import HeaderButtons from "./buttons/HeaderButtons";
// import CategoryBar from "./categories/CategoryBar";
import SearchBar from "./searchbar/SearchBar";
// import { connect } from "react-redux";

class HeaderContainer extends Component {
  state = {};
  render() {
    return (
      <Container maxWidth="xl" className="header-container">
        <HeaderButtons />
        <SearchBar />
      </Container>
    );
  }
}

// const mapStateToProps = (state) => {
//   console.log(state);
//   return {
//     logged: state.user.logged,
//     name: state.user.name,
//   };
// };

// export default connect(mapStateToProps, null)(HeaderContainer);
export default HeaderContainer;
