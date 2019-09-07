import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const AppTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#3e3edc'
    },
    secondary: {
      main: '#d38f32'
    },
  },
  typography: {
    fontFamily: `Roboto, Poppins, "Segoe UI", Arial, sans-serif`,
  },
});

export const LocalLightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#3e3edc'
    },
    secondary: {
      main: '#f83922'
    },
  },
  typography: {
    fontFamily: `Roboto, Poppins, "Segoe UI", Arial, sans-serif`,
  },
});