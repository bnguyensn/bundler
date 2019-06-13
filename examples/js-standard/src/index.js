import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.css';

ReactDOM.render(<App />, document.getElementById('root'));

// Debug - The constant DEFINEPLUGIN.DEVMODE is injected by webpack's
// DefinePlugin. See the webpack config file.
if (DEFINEPLUGIN.DEVMODE) {
  console.log('Application running in development mode.');
}

// Initialise webpack Hot Module Replacement
// This is only relevant for development runs.
if (module.hot) {
  module.hot.accept('./index.js', () => {
    console.log('webpack Hot Module Replacement updated successfully!');
  });
}

// Should only do in production mode
if ('serviceWorker' in navigator && !DEFINEPLUGIN.DEVMODE) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
