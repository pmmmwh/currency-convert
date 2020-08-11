import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { ErrorBoundary } from 'react-error-boundary';
import BackToTop from '../components/BackToTop';
import AuthProvider from '../components/AuthProvider';
import ThemeProvider from '../components/ThemeProvider';
import ErrorFallback from './ErrorFallback';
import MainContent from './MainContent';

function App() {
  // This is used to provide scroll-to-top functionality
  const topAnchorId = 'top-anchor';

  return (
    // Attach a global error boundary in case something goes really wrong
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <AppBar elevation={0}>
          <Toolbar>
            <Typography variant="h6">Currency Convert</Typography>
          </Toolbar>
        </AppBar>
        {/* This separate toolbar provides top padding for main content */}
        <Toolbar id={topAnchorId} />
        <AuthProvider>
          <MainContent />
        </AuthProvider>
        <BackToTop anchorId={topAnchorId} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
