import * as React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThemeProvider from '../components/ThemeProvider';

const useStyles = makeStyles({
  main: {
    height: '100vh',
    width: '100vw',
  },
});

function ErrorFallback() {
  const classes = useStyles();

  function handleRetry() {
    window.location.reload();
  }

  return (
    <ThemeProvider>
      <Grid
        alignContent="center"
        alignItems="center"
        className={classes.main}
        container
        justify="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <Typography align="center" variant="h3">
            <Typography color="secondary" component="span" variant="inherit">
              Something
            </Typography>
            {' went wrong.'}
          </Typography>
        </Grid>
        <Grid item>
          <Button color="primary" disableElevation onClick={handleRetry} variant="contained">
            Reload and try again
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default ErrorFallback;
