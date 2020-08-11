import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(10, 22, 104)',
    },
    secondary: {
      main: 'rgb(250, 165, 170)',
    },
  },
  typography: {
    // Use Gilroy as default font, and fallback to universal sans-serif fonts
    fontFamily: ['"Gilroy"', 'Helvetica', 'Arial', 'sans-serif'].join(', '),
    // These font weights are unavailable from CDN - so we 'interpolate' them
    fontWeightLight: 400,
    fontWeightMedium: 700,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiCssBaseline: {
      '@global': {
        // Inject font-face declarations for `medium` and `bold` weights of Gilroy
        '@font-face': [
          {
            fontDisplay: 'swap',
            fontFamily: 'Gilroy',
            fontStyle: 'normal',
            fontWeight: 400,
            src: [
              "local('Gilroy')",
              "local('Gilroy-Regular')",
              "url('https://d283q1g7ei3fhy.cloudfront.net/gilroy-medium.woff2') format('woff2')",
            ].join(', '),
          },
          {
            fontDisplay: 'swap',
            fontFamily: 'Gilroy',
            fontStyle: 'bold',
            fontWeight: 700,
            src: [
              "local('Gilroy')",
              "local('Gilroy-Bold')",
              "url('https://d283q1g7ei3fhy.cloudfront.net/gilroy-bold.woff2') format('woff2')",
            ].join(', '),
          },
        ],
      },
    },
  },
});

export default theme;
