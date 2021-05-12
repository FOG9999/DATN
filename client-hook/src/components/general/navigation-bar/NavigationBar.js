import { Box } from "@material-ui/core";
import React, { Component, useState } from "react";
import OneDirection from "./OneDirection";

// props.direction = [{
//     icon: Material UI Icon,
//     main: Component được render,
//     content: Tiêu đề
// },...]

function NavigationBar(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  function onClick(index) {
    props.changeMainComponent(props.directions[index].main);
    setSelectedIndex(index);
  }
  return (
    <Box minWidth="250px" className="white-background">
      {props.directions.map((direction, index) => {
        return (
          <OneDirection
            selected={selectedIndex === index}
            onClick={() => onClick(index)}
            direction={direction}
            key={index}
          />
        );
      })}
    </Box>
  );
}

export default NavigationBar;
