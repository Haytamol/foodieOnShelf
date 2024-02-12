import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

//Create a theme with the colors we want
const theme = createTheme({
  palette: {
    primary: {
      main: "#ffb647",
      darker: "#053e85",
    },
  },
});

export default function AddButton({ onClick }) {
  return (
    <ThemeProvider theme={theme}>
      <Box onClick={onClick}>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

//sx={{ "& > :not(style)": { m: 1 } }}
