import React from "react";
import { Box } from "@material-ui/core";

function OneDirection(props) {
  return (
    <Box
      display="flex"
      style={
        props.selected
          ? { backgroundColor: "rgb(238, 77, 46)", color: "white" }
          : {}
      }
      p={2}
      pl="40px"
      alignItems="center"
      className="cursor-pointer"
      onClick={props.onClick}
    >
      {props.direction.icon}
      <Box ml={1}>{props.direction.content}</Box>
    </Box>
  );
}

export default OneDirection;
