import * as React from 'react';
import { Fab, useMediaQuery, useScrollTrigger, Zoom } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@material-ui/icons';
import type { MouseEvent } from 'react';

export interface BackToTopProps {
  anchorId: string;
}

const useStyles = makeStyles((theme) => ({
  button: {
    bottom: theme.spacing(2),
    position: 'fixed',
    right: theme.spacing(2),
  },
}));

function BackToTop({ anchorId }: BackToTopProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  // Only show trigger when scroll position exceeds the threshold
  const trigger = useScrollTrigger({
    // Disable scroll direction detection before we exit the 'threshold zone'
    disableHysteresis: true,
    // The values below are default heights (in material-ui) for a TopBar
    threshold: isDesktop ? 64 : 56,
  });
  const classes = useStyles();

  const handleClick = (event: MouseEvent) => {
    // Search for an element with `id` = `anchorId`,
    // and if found scroll to it's vertical starting point (i.e. top).
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).getElementById(
      anchorId
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div className={classes.button} onClick={handleClick} role="presentation">
        <Fab aria-label="scroll back to top" color="secondary" size="small">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
}

export default BackToTop;
