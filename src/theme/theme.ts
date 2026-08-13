import { createTheme } from "@mui/material";

// Palette based on https://github.com/minimal-ui-kit/material-kit-react
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      lighter: "#D0ECFE",
      light: "#73BAFB",
      main: "#1877F2",
      dark: "#0C44AE",
      darker: "#042174",
      contrastText: "#FFFFFF",
    },
    secondary: {
      lighter: "#EFD6FF",
      light: "#C684FF",
      main: "#8E33FF",
      dark: "#5119B7",
      darker: "#27097A",
      contrastText: "#FFFFFF",
    },
    info: {
      lighter: "#CAFDF5",
      light: "#61F3F3",
      main: "#00B8D9",
      dark: "#006C9C",
      darker: "#003768",
      contrastText: "#FFFFFF",
    },
    success: {
      lighter: "#D3FCD2",
      light: "#77ED8B",
      main: "#22C55E",
      dark: "#118D57",
      darker: "#065E49",
      contrastText: "#FFFFFF",
    },
    warning: {
      lighter: "#FFF5CC",
      light: "#FFD666",
      main: "#FFAB00",
      dark: "#B76E00",
      darker: "#7A4100",
      contrastText: "#1C252E",
    },
    error: {
      lighter: "#FFE9D5",
      light: "#FFAC82",
      main: "#FF5630",
      dark: "#B71D18",
      darker: "#7A0916",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: "#FCFDFD",
      100: "#F9FAFB",
      200: "#F4F6F8",
      300: "#DFE3E8",
      400: "#C4CDD5",
      500: "#919EAB",
      600: "#637381",
      700: "#454F5B",
      800: "#1C252E",
      900: "#141A21",
    },
    text: {
      primary: "#1C252E",
      secondary: "#637381",
      disabled: "#919EAB",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    divider: "rgba(145, 158, 171, 0.2)",
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          maxWidth: "100vw",
          overflowX: "hidden",
        },
        body: {
          minHeight: "100vh",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },
  },
});
