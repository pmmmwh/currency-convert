import * as React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export interface LoadingProps {
  className?: string;
  open?: boolean;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    // Make sure the backdrop is above everything (drawer has the highest zIndex)
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function Loading({ className, open = false }: LoadingProps) {
  const classes = useStyles();

  return (
    <Backdrop className={clsx(classes.backdrop, className)} open={open}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

export default Loading;
