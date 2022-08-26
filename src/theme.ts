import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: {
    borderRadius: 10,
  },
  spacing: 10,
  palette: {
    mode: 'dark',
    divider: '#bbbbbb',
    primary: {
      light: '#c89efc',
      main: '#BB86FC',
      dark: '#825db0',
      contrastText: '#000',
    },
    secondary: {
      light: '#35e1d0',
      main: '#03DAC5',
      dark: '#018786',
      contrastText: '#000',
    },
    error: {
      light: '#bf334c',
      main: '#FF2E4D',
      dark: '#7b0016',
    },
    background: {
      default: '#001328',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#F2F2F2',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: '3rem',
      fontFamily: `Oswald, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontFamily: `Oswald, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontFamily: `Cabin, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    },
  },
});

export default theme;
