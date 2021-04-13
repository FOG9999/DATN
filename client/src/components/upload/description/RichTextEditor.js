import React, { Component } from "react";
import { Box } from "@material-ui/core";
import RichTextEditor from "react-rte";

class ProductDescription extends Component {
  state = {
    // value: RichTextEditor.createEmptyValue(),
    // htmlStr: RichTextEditor.createEmptyValue().toString("html"),
  };

  // onChangeEditorState = (value) => {
  //   this.setState({
  //     value: value,
  //     htmlStr: value.toString("html"),
  //   });
  // };

  render() {
    return (
      <Box>
        <RichTextEditor
          value={this.props.value}
          onChange={this.props.onChangeEditorState}
        />
        <Box>
          <div dangerouslySetInnerHTML={{ __html: this.state.htmlStr }} />
        </Box>
      </Box>
    );
  }
}

export default ProductDescription;
