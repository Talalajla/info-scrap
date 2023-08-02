import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/articleGallery.css";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from '@mui/material';
import './base.tsx';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'sans-serif'
    ].join(','),
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#bb86fc',
      contrastText: '#fff',
    },
  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} maxSnack={3} autoHideDuration={5000}>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
