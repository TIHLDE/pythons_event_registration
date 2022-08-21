import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
});

export default theme;
