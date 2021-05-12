import React from "react";
import { Container, Box } from "@material-ui/core";
import Login from "./Login";

function Background() {
  return (
    <Container maxWidth="xl" className="login-background-container0">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        py="100px"
      >
        <Login />
      </Box>
    </Container>
  );
}

export default Background;
