// theme.js
import { createTheme } from "@mui/material/styles";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "hsl(36, 69%, 40%)",
    },
    secondary: {
      main: "hsl(20, 80%, 32%)",
    },
  },
});

export default theme;