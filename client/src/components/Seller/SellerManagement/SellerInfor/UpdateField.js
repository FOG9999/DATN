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
            onChange={this.onChangeNumberInput}
          />
        );
      }
      case "radio": {
        return null; // update later
      }
      case "date": {
        return (
          <DatePicker
            selected={new Date(this.props.changingVal)}
            onChange={this.onChangeDatePicker}
          />
        );
      }
      default:
        return null;
    }
  };
  onChangeDatePicker = (date) => {
    this.props.onChange(date.toLocaleDateString(), "birthday");
  };
  onChangePhoneInput = (e) => {
    if (/\D|\s/.test(e.target.value)) {
      toast.error("Chỉ nhập số cho trường này");
    } else {
      this.props.onChange(e.target.value, "phone");
    }
  };
  onChangeTextInput = (e) => {
    if (e.target.value) {
      this.props.onChange(e.target.value, e.target.name);
    } else {
      toast.error("Trường không được để trống");
    }
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
          ) : (
            <big>
              <b>{this.props.altValue}</b>
            </big>
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
