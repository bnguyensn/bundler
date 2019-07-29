import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.css';

ReactDOM.render(<App />, document.getElementById('root'));

// Debug - The constant DEFINEPLUGIN.DEVMODE is injected by webpack's
// DefinePlugin. See the webpack config file.
if (DEFINEPLUGIN_DEVMODE) {
  console.log('Application running in development mode.');
}

// Initialise webpack Hot Module Replacement
// This is only relevant for development runs.
if (module.hot) {
  module.hot.accept('./index.js', () => {
    const Next = require('./App');
    ReactDOM.render(<Next />, document.getElementById('root'));

    console.log('webpack Hot Module Replacement updated successfully!');
  });
}

// Should only do in production mode and if we have a service worker file.
if (DEFINEPLUGIN_SERVICEWORKER && !DEFINEPLUGIN_DEVMODE) {
  if ('serviceWorker' in navigator) {
    // ============================ //
    // 1. REGISTER A SERVICE WORKER
    // ============================ //
    // Registration simply means telling the browser where the service worker
    // JavaScript file is. Registration can be performed on every page load
    // without concern as the browser will handle different cases accordingly.

    self.addEventListener('load', () => {
      navigator.serviceWorker
        // By registering the service worker at the root domain, its scope
        // will be the entire domain.
        .register('/service-worker.js')
        .then(
          registration => {
            // On successful registration, the service worker is executed in a
            // special worker context, separate from the main JavaScript
            // execution thread. This context does not have access to the DOM.
            // TODO: notify user of successful service worker registration
            console.log(
              `Successfully registered the service worker: ${registration}`,
            );
          },
          err => {
            console.error(`Cannot register service worker: ${err}`);
          },
        );
    });
  } else {
    console.log('Service worker is not supported by this browser 😔.');
  }
}
