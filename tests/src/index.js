import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.css';
import registerServiceWorker from './service-worker';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./index.js', () => {
    console.log('Webpack Hot Module Replacement updated successfully!');
  });
}

registerServiceWorker();
