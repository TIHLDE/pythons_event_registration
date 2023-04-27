import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    menu: Palette['primary'];
  }
  interface PaletteOptions {
    menu: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    menu: true;
  }
}

const theme = createTheme({
  shape: {
    borderRadius: 10,
  },
  spacing: 10,
  palette: {
    mode: 'dark',
    divider: '#aaaaaa',
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
    menu: {
      main: '#fafafa',
      contrastText: '#000',
    },
    error: {
      light: '#bf334c',
      main: '#FF2E4D',
      dark: '#7b0016',
    },
    background: {
      default: '#001328',
      paper: '#001731',
    },
    text: {
      primary: '#F2F2F2',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          html: { WebkitFontSmoothing: 'auto' },
        },
        a: { color: '#F2F2F2' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: '1px solid #424242',
          width: 400,
          padding: 3 * 10,
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
