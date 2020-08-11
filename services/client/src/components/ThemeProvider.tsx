import * as React from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../utils/theme';
import type { ThemeProviderProps } from '@material-ui/core/styles';
import type { Except } from 'type-fest';

function ThemeProvider({ children, ...restProps }: Except<ThemeProviderProps, 'theme'>) {
  return (
    <MuiThemeProvider theme={theme} {...restProps}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
