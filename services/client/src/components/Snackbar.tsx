import * as React from 'react';
import { Snackbar as MuiSnackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import type { SnackbarCloseReason } from '@material-ui/core/Snackbar';
import type { Color } from '@material-ui/lab/Alert';
import type { PropsWithChildren, SyntheticEvent } from 'react';

export interface SnackbarProps {
  onClose?: (event: SyntheticEvent, reason?: SnackbarCloseReason) => void;
  open?: boolean;
  variant?: Color;
}

function Snackbar({
  children,
  onClose,
  open = false,
  variant = 'error',
}: PropsWithChildren<SnackbarProps>) {
  const handleSnackbarClose = (event: SyntheticEvent, reason?: SnackbarCloseReason) => {
    // Disable dismissal via click-away
    if (reason === 'clickaway') {
      return;
    }

    onClose?.(event, reason);
  };

  return (
    <MuiSnackbar autoHideDuration={6000} onClose={handleSnackbarClose} open={open}>
      <Alert elevation={6} onClose={handleSnackbarClose} severity={variant} variant="filled">
        {children}
      </Alert>
    </MuiSnackbar>
  );
}

export default Snackbar;
