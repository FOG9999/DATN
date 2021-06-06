import { Box, IconButton, TextField } from "@material-ui/core";
import { Check, Close, Create, Replay } from "@material-ui/icons";
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

class UpdateField extends Component {
  state = {};
  returnInputForUpdating = (type) => {
    switch (type) {
      case "text": {
        return (
          <TextField
            value={this.props.changingVal}
            fullWidth
            size="small"
            error={this.props.error}
            name={this.props.fieldName}
            onChange={this.onChangeTextInput}
          />
        );
      }
      case "number": {
        return (
          <TextField
            value={this.props.changingVal}
            fullWidth
            size="small"
            error={this.props.error}
            name={this.props.fieldName}
            onChange={this.onChangePhoneInput}
          />
        );
      }
      case "radio": {
        return null; // update later
      }
      case "date": {
        return (
          <DatePicker
            selected={this.props.changingVal}
            onChange={this.onChangeDatePicker}
          />
        );
      }
      default:
        return null;
    }
  };
  onChangeDatePicker = (date) => {
    this.props.onChange(date, "birthday");
  };
  onChangePhoneInput = (e) => {
    if (/\D|\s/.test(e.target.value)) {
      toast.error("Chỉ nhập số cho trường này");
    } else if (e.target.value.length > 10) {
      toast.error("Số điện thoại không hợp lệ");
    } else {
      this.props.onChange(e.target.value, "phone");
    }
  };
  onChangeTextInput = (e) => {
    this.props.onChange(e.target.value, e.target.name);
  };
  render() {
    return (
      <Box display="flex" p={1}>
        <Box display="flex" alignItems="center" width="200px">
          {this.props.title}
        </Box>
        <Box width="500px" px={1} display="flex" alignItems="center">
          {this.props.isUpdating ? (
            this.returnInputForUpdating(this.props.type)
          ) : this.props.type === "date" ? (
            new Date(this.props.altValue).toLocaleDateString()
          ) : (
            <span className={this.props.error ? "color-red" : ""}>
              {this.props.altValue}
            </span>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          {!this.props.isUpdating ? (
            <IconButton
              onClick={() => this.props.onUpdating(this.props.fieldName)}
            >
              <Create size="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => this.props.closeUpdating(this.props.fieldName)}
            >
              <Close size="small" />
            </IconButton>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          {!this.props.isUpdating ? (
            <IconButton
              onClick={() => this.props.reloadValue(this.props.fieldName)}
            >
              <Replay size="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => this.props.updateValue(this.props.fieldName)}
            >
              <Check size="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  }
}

export default UpdateField;
