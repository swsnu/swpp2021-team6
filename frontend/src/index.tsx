import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import axios from 'axios';
import { Provider } from 'react-redux';
import App from './App';
import store, { history } from './store/store';

// CSRF TOKEN
// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);
