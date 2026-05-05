import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// In development, Strict Mode double-invokes effects which breaks socket connections
// Only enable Strict Mode when debugging specific React issues
const isDevelopment = import.meta.env.DEV;
const enableStrictMode = false; // Set to true only when debugging React issues

const AppWrapper = enableStrictMode ? React.StrictMode : React.Fragment;

root.render(
  React.createElement(
    AppWrapper,
    null,
    React.createElement(
      BrowserRouter,
      { future: { v7_startTransition: true, v7_relativeSplatPath: true } },
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          AuthProvider,
          null,
          React.createElement(
            SocketProvider,
            null,
            React.createElement(App)
          )
        )
      )
    )
  )
);